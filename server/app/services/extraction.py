import ollama
import json
import re
from rdflib import Graph

def extract_structured_data(conversation):
    """ Extracts structured JSON data from the conversation log. """
    
    analysis_prompt = f"""
    Analyse la conversation suivante et extrait les informations sous format JSON structuré :
    {conversation}

    **IMPORTANT** :
    1. Ne réponds qu'avec un JSON valide, sans aucun texte supplémentaire.
    2. Si une information est absente, mets "null".
    3. Si l'utilisateur n'a pas de preference, mets "null".


    Information à extraire :
    {{
        - Domaine de l'application
        - Compétences à acquérir
        - Type de formation (initial, à vie, continue)
        - Handicap
        - Métier visé (Les metiers de l'IA et de la DATA, Exemple : ingénieur en NLP, chercheur en IA, etc.)
        - Niveau de formation souhaité
        - Ville ou région ou département souhaité
    }}
    """

    response = ollama.chat(model="llama3", messages=[
        {"role": "system", "content": analysis_prompt}
    ])

    json_text = response['message']['content']

    # 🔹 DEBUG: Print the raw response from Ollama
    print("🔍 RAW RESPONSE FROM OLLAMA:")
    print(json_text)
    print("--------------------------------------------------")

    # Extract only the JSON part using regex
    json_match = re.search(r"\{.*\}", json_text, re.DOTALL)
    if json_match:
        json_text = json_match.group(0)

    try:
        structured_data = json.loads(json_text)
    except json.JSONDecodeError:
        print("❌ Erreur: Impossible d'extraire un JSON valide.")
        structured_data = {}

    return structured_data