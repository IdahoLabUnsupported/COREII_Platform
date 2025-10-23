# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# TODO: implement entity extraction model for unstructured text
if False:

    import os
    from transformers import pipeline, logging

    # Silence warning aboue some model weights not being used.
    # This is expected since its a custom fine-tuned model.
    logging.set_verbosity_error()

    MODEL_PATH = os.path.join(
        os.path.dirname(__file__),
        "models",
        "bert-large-cased-finetuned-conll03-english",
    )

    def extract_entities(text: str) -> list[dict]:
        """Perform Named Entity Recognition using a pre-trained BERT model."""
        ner = pipeline(
            "ner",
            model=MODEL_PATH,
            aggregation_strategy="max",
            device="cpu",  # TODO: add GPU support in production environment
        )
        results = ner(text)
        results = [
            {
                "title": r["word"],
                "entity_type": r["entity_group"],
                "excerpt_start_index": r["start"],
                "excerpt_end_index": r["end"],
            }
            for r in results
        ]
        return results


if __name__ == "__main__":
    text = "In October 2024, Eric used a BERT model trained by Google to analyze text in San Diego, CA."
    results = extract_entities(text)
    for r in results:
        print(r)
