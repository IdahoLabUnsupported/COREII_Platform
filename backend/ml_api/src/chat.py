# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

from pydantic import BaseModel, Field
from datetime import datetime

from src.utils import string_to_json

from src.open_ai_llm import get_llm_response


class DetermineChatActionPayload(BaseModel):
    messages: list[dict] = Field(
        ..., example=[{"role": "user", "content": [{"text": "Hello World!"}]}]
    )
    dataOverview: str = ""


def determine_chat_action(messages: list[dict], dataOverview: str = "") -> str:
    """
    Based on the chat history, decide on an action to take.
    Use this to determine whether a user request can be answered
    as-is, or whether it needs RAG or some other action first.
    """
    current_year = int(datetime.now().year)
    cleaned_messages = ", ".join(clean_messages(messages))
    prompt = f"""
    # Intro
    
    You are the COREII chatbot assistant. COREII is the US Department of Energy (DOE) Cybersecurity Operations Research, Experimentation, Integration, and Innovation platform, which is focused on cybersecurity for operational technology. Here is an overview of the datasets you have access to, and the quantity of objects in your database: <DATA_OVERVIEW>{dataOverview}</DATA_OVERVIEW>.

    # Your job

    Your job is to determine the next course of action in the conversation. There are always two options:
    (a) respond to the user immediately, or
    (b) look up some information before responding.

    ## (a) Responding immediately
    
    If the user says something that doesn't reference your knowledge base at all, like "thank you", "hello", or "I'd like to ask a question", you can do (a), respond immediately, by returning JSON like this: {{"action": "respond", "response": ...}}, where "response" is your response to the user. If you need more information before responding, you can ask the user for clarification, for example like this: {{"action": "respond", "response": "It sounds like you might be asking about ... Can you be more specific?"}}.
    
    ## (b) Looking up information

    If the user asks about, or references, anything specific, including information that was previously mentioned in the chat, you need to do (b) and lookup information before responding. Here are some examples where you need to look something up:
    - tell me about natural gas prices
    - ICSA-25-056-01
    - What OSTI records mention cyber?
    - vulnerabilities in philips products
    In all these cases, you need to do (b) and look up the information in the database, and return JSON like this: {{"action": "lookup", "topic": ...}}, where topic is the topic you need to look up. Be smart and infer the cyber topic you need to look up from context. For example if a previous user message said "Tell me about research that suports Goal 1: Smart observability, and Goal 2: Rapid response", and then asks a followup question about goal 1, in the followup response the lookup topic should be "smart observability", not "goal 1". In general, never lookup a vague topic name, like "task 1", "priority 2",  or "3rd bullet point". Lookup the actual cyber topic that is associated with the vague name.
    
    ### Specifying a dataset

    In the case that the user suggests a topic you need to look up and also explicitly mentions a dataset, do action (b) but return the dataset abbreviation as well. For example, if the user asks: "which OSTI publications contain information about operational technology?", you would return JSON like this: {{"action": "lookup"", "topic": "operational technology", "dataset": "OSTI"}}. If the user asks about "CISA vulnerabilities" or "CISA", use "CISA" for the dataset. If they ask about "exploited vulnerabilities", then use "KEV" for the dataset. When a dataset is not explicitly mentioned, do not return a 'dataset' key, except when the user is asking about estimates of cost in energy production, natural gas, or similar energy generation numbers. In that case, use 'EIA' as the dataset value.

    ### Specifying a report

    In the case that the user mentions a dataset and a report, do action (b) and return the dataset and the report name. For example, if the user says "tell me about the CyOTE New Cooperative report", you would return JSON like this: {{"action": "lookup"", "dataset": "CYOTE", "report": "New Cooperative"}}. If the user says "ARBOLA SLAC Branch Driver for PDP-11 OSTI report", you would return JSON like this: {{"action": "lookup"", "dataset": "OSTI", "report": "ARBOLA SLAC Branch Driver for PDP-11"}}. 

    ### Specifying a date range

    In the case that the user explicitly asks about recent data, or data after a certain year, add an 'earliest_year' key to the JSON. The current year is {current_year}, so if the user asks about "malware reported in the past 5 years, you would subtract 5 from the current year and return JSON like this: {{"action": "lookup", "topic": "malware", "earliest_year": "{current_year - 5}"}}. If the user asks about 'this year', use {current_year} as the earliest year. If the user explicitly says they want something 'recent' but doesn't specify the year, use {current_year - 1} for the year. Otherwise, don't specify a year. For example, if the user says 'List recent vulnerabilities in Philips products', you would return JSON like this: {{"action": "lookup", "topic": "vulnerabilities in Philips products", "earliest_year": {current_year - 1}}}. If the user says 'CyOTE reports mentioning wannacry published in 2023', you would return JSON like this: {{"action": "lookup", "topic": "wannacry", "dataset": "CYOTE", "earliest_year": 2023}}. If the user says "tell me about the Ukraine cyber attack", no year or indication of recency was indicated, so return JSON without the 'earliest_year' key like this: {{"action": "lookup", "topic": "Ukraine cyber attack"}}.

    ### Referencing a prior lookup

    In some cases, the user may ask a question about some information that was previously referenced in the chat. For example, the chat messages might look like:
    user: "tell me about the OSTI report called New Frontiers in Cyber"
    assistant: "The report is about ..."
    user: "give me an executive summary with details about topic X"
    In this case, you need to answer the user's most recent by looking up the report again. So you'd use the chat history to deduce which information you need to lookup, and respond like {{"action": "lookup"", "dataset": "OSTI", "report": "New Frontiers in Cyber"}}. This pattern most often occurs when the user asks a followup question to a previous message, like:
    - was topic X mentioned?
    - what was the conclusion?
    - give me an executive summary
    In these cases, determine what to look up based on prior messages, and respond appropriately.

    # Summary
    
    Never return anything except action (a) or action (b) in pure JSON. Be conversational, chatty, and thorough in your responses. Here is the conversation between the user and the assistant: <messages>{cleaned_messages}</messages>. Based on the messages, what is the best course of action for the assistant? Respond with the appropriate JSON.
    """
    prompt = prompt.strip()
    response = get_llm_response([{"role": "user", "content": [{"text": prompt}]}])
    print(response)
    return string_to_json(response)


def clean_messages(messages: list[dict]) -> list[dict]:
    """Remove unnecessary tokens from a list of messages so
    only the message content is returned."""
    cleaned_messages = []
    for m in messages:
        cleaned_messages.append(f"<{m['role']}: {m['content'][0]['text']}>")
    return cleaned_messages


def test_chat():
    """
    Test the chat flow in which messages are either routed to RAG or
    responded to directly.

    This flow is orchestrated on the frontend client, so that the
    messages logic can be managed there in order to keep separation
    of concerns between the ML API and KG API.
    """
    messages = [
        {"role": "system", "content": [{"text": "you are named Bob the AI model."}]}
    ]
    assistant_message = "Hi! How can I help you?"

    while True:
        user_message = input(assistant_message + "\n")
        messages.append({"role": "user", "content": [{"text": user_message}]})

        # determine best course of action
        action = determine_chat_action(messages)

        if action:
            if action.get("action") == "respond" and action["response"]:
                # immediately return the response
                new_response = action["response"]

            elif action.get("action") == "lookup" and action["topic"]:
                # do RAG on the tool_call topic
                search_results = []
                retrieved_content = " ".join(search_results)
                # add RAG content to user message
                messages[-1]["content"][0][
                    "text"
                ] += f" __CONTEXT__: {retrieved_content}"
                # get LLM reponse based on RAG content
                new_response = get_llm_response(messages)
        else:
            new_response = get_llm_response(messages)

        # return complete message chain
        messages = messages + [
            {"role": "assistant", "content": [{"text": new_response}]}
        ]
        assistant_message = messages[-1]["content"][0]["text"]


if __name__ == "__main__":
    test_chat()
