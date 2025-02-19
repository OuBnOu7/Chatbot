from flask import Blueprint, jsonify, request
from app.models import OntologyModel
import ollama
from app.services.extraction import extract_structured_data

routes = Blueprint('routes', __name__)

ontology = OntologyModel()

@routes.route('/')
def home():
    formations = ontology.get_formations()
    return jsonify(formations)

# Maximum number of messages before ending the chat
MAX_MESSAGES = 10

# Prompt for structured extraction
EXTRACTION_PROMPT = """
Tu es un chatbot qui extrait les informations importantes d'un utilisateur cherchant une formation en IA en France.
À partir de son message, essaie de poser des questions (une seule à la fois) sur les critères de la formation souhaitée :

Ce que tu dois demander :
- Domaine de l'application
- Compétences à acquérir
- Type de formation (initial, à vie, continue)
- Handicap
- Métier visé
- Niveau de formation souhaité
- Ville ou région ou département souhaité

**IMPORTANT** :
1. Ne pose qu’une seule question à la fois.
2. Ne recommande pas de formation, essaie juste d'extraire les critères.
3. Ne fais pas de récapitulatif et ne repose pas de questions déjà posées.
"""

conversation_log = [{"role": "system", "content": EXTRACTION_PROMPT}]

@routes.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get("message", "")
    
    if not user_input:
        return jsonify({"error": "Message requis"}), 400

    conversation_log.append({"role": "user", "content": user_input})

    if user_input.lower() in ["fin", "j'ai terminé", "c'est tout"]:
        # Send Conversation to the extraction service
        structured_data = extract_structured_data(conversation_log)
        conversation_log.clear()
        # Message de fin
        print(structured_data)
        return jsonify({"response": "Merci pour ces informations ! Je vais les analyser."})
        
    response = ollama.chat(model="llama3", messages=conversation_log)
    bot_response = response['message']['content']
    conversation_log.append({"role": "assistant", "content": bot_response})

    
    return jsonify({"response": bot_response})
