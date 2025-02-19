import ollama

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

def chatbot():
    """ Engage in a conversation while maintaining memory of previous exchanges. """
    conversation_log = [
        {"role": "system", "content": EXTRACTION_PROMPT}
    ]
    chat = []
    
    print("🤖 Bonjour ! Parle-moi de la formation que tu recherches en IA.")

    for _ in range(MAX_MESSAGES):
        user_input = input(" > ")  # Get user message
        conversation_log.append({"role": "user", "content": user_input})
        chat.append({'User : ', user_input})

        if user_input.lower() in ["fin", "j'ai terminé", "c'est tout"]:
            print("🤖 Merci pour ces informations ! Je vais les analyser.")
            break

        response = ollama.chat(model="llama3", messages=conversation_log)
        bot_response = response['message']['content']

        print(f"🤖 {bot_response}")
        conversation_log.append({"role": "assistant", "content": bot_response})  # Keep AI responses in memory
        chat.append({'Bot : ', bot_response})

    return chat  # Return full conversation