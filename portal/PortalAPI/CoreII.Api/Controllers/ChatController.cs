// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System.ClientModel;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI;
using OpenAI.Chat;

namespace CoreIIApi.Controllers;

[Route("api/chat")]
[ApiController]
public class ChatController : Controller
{
    private readonly IConfiguration _config;
    public ChatController(IConfiguration config)
    {
        _config = config;
    }

    [HttpGet]
    [Authorize]
    [Route("query-request-full")]
    public async Task<IActionResult> QueryRequest(string query)
    {
        try
        {
             string endpoint = _config["ChatSettings:ApiUrl"];
            string apiKey = _config["ChatSettings:ApiKey"];
            string model = _config["ChatSettings:Model"];

            Uri uri = new Uri(endpoint);
            ApiKeyCredential keyCredential = new ApiKeyCredential(apiKey);

            ChatClient client = new ChatClient(model, keyCredential,
                new OpenAIClientOptions { Endpoint = uri });
            var request = await client.CompleteChatAsync([
                new UserChatMessage(query)
            ]);
            
            return Ok(request);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex}");
        }
    }
    
    [HttpGet]
    [Authorize]
    [Route("query-request-stream")]
    public async IAsyncEnumerable<string> QueryRequestStream(string query)
    {
        
            string endpoint = _config["ChatSettings:ApiUrl"];
            string apiKey = _config["ChatSettings:ApiKey"];
            string model = _config["ChatSettings:Model"];

            Uri uri = new Uri(endpoint);
            ApiKeyCredential keyCredential = new ApiKeyCredential(apiKey);

            ChatClient client = new ChatClient(model, keyCredential,
                new OpenAIClientOptions { Endpoint = uri });
            
            var request =  client.CompleteChatStreamingAsync([
                new UserChatMessage(query)
            ]);

            await foreach (StreamingChatCompletionUpdate chatupdate in request)
            {
                foreach (ChatMessageContentPart contentPart in chatupdate.ContentUpdate)
                {
                    yield return contentPart.Text;
                }
            }
    }
    
    [HttpGet]
    [Authorize]
    [Route("ping")]
    public async Task<IActionResult> Ping()
    {
        HttpClient client = new HttpClient();

        try
        {
            string endpoint = _config["ChatSettings:ApiUrl"];
            string ping = _config["ChatSettings:ApiPing"];
            string apiKey = _config["ChatSettings:ApiKey"];
            
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            HttpResponseMessage response = await client.GetAsync(endpoint + "/" + ping);
            response.EnsureSuccessStatusCode();
            
            string responseBody = await response.Content.ReadAsStringAsync();
            
            return Ok(responseBody);
        }
        catch(Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex}");
        }
    }
}