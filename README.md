# Docu-Mind: AI-Powered Intelligent Document Q&A System  

## 📌 Overview  

**Docu-Mind** is an intelligent AI solution that allows users to ask natural language questions about lengthy or complex PDF files and receive precise answers drawn directly from the document content.  
Built on **Retrieval-Augmented Generation (RAG)**, it integrates semantic retrieval with generative reasoning to produce **reliable, contextually accurate, and verifiable** results.

### 🔹 Key Technologies:
- **LLMs & Embeddings**: OpenAI GPT-4 and `text-embedding-ada-002`  
- **Vector Database**: Pinecone (for semantic document retrieval)  
- **Backend Framework**: FastAPI (Python)  
- **Frontend Framework**: React.js (Chat-based interface)  
- **PDF Processor**: PyPDF2 (structured text extraction; no OCR support)  

---

## ⚙️ System Architecture  

### **High-Level Architecture Overview**

1. **User Interaction**
   - Through the **React frontend**, users can upload PDF documents and enter their queries.  
   - The system interprets the query and processes it using OpenAI’s **LLM** combined with precomputed **vector embeddings**.

2. **Backend (FastAPI)**
   - Handles all REST APIs related to PDF upload, query processing, and interaction with the LLM.  
   - Coordinates communication among modules responsible for **text extraction**, **vector storage**, and **query resolution**.

3. **PDF Processing Module**
   - Extracts and preprocesses textual data from PDF files using **PyPDF2**.  
   - Divides text into **structured and meaningful chunks** to enhance search and retrieval efficiency.

4. **Embedding Model (OpenAI)**
   - Converts each text segment into numerical **vector embeddings** via `text-embedding-ada-002`.  
   - These embeddings are stored in **Pinecone** for quick similarity-based searches.

5. **Vector Database (Pinecone)**
   - Maintains the document chunks and their embeddings.  
   - Supports **rapid semantic similarity lookups** to find the most relevant portions of the document.

6. **Semantic Retrieval & Context Builder**
   - Encodes each user query into a vector representation.  
   - Retrieves and ranks document chunks in **Pinecone** based on contextual similarity.  
   - Constructs a **context window** containing the top-matching text for LLM processing.

7. **Generative Reasoning (LLM Layer)**
   - The LLM combines the user query with retrieved context to generate a coherent, well-structured answer.

8. **Response to User**
   - The chatbot displays the **final answer** in the frontend interface, including relevant context or citations.

---

## 🔄 Data Flow Process  

1️⃣ **PDF Upload** → The user uploads a document via the web interface.  
2️⃣ **Text Extraction & Chunking** → Extracted text is cleaned and divided into smaller, searchable segments.  
3️⃣ **Embedding Generation** → Each segment is converted into a **vector embedding** using OpenAI’s API.  
4️⃣ **Storage in Pinecone** → Embeddings are stored for **fast retrieval**.  
5️⃣ **Query Submission** → The user submits a question.  
6️⃣ **Semantic Retrieval** → Pinecone identifies relevant text chunks from the document.  
7️⃣ **Context Formation** → The top matches are compiled into a prompt for GPT-4.  
8️⃣ **Answer Generation** → The model generates a precise response based on retrieved context.  
9️⃣ **Response Display** → The final answer is presented in the chat interface.

---

## 📊 Evaluating System Responses  

To ensure **Docu-Mind** provides accurate and meaningful outputs, response quality is assessed using **LlamaIndex** evaluation methods.  
These tools measure **contextual relevance** and **response accuracy** without the need for pre-labeled datasets.

### **Relevance Evaluation (No Ground Truth Needed)**

- The **`RelevancyEvaluator`** within LlamaIndex verifies whether generated responses align with the retrieved document sections.  
- This ensures the chatbot maintains factual and contextually sound output.

### Reference Screenshots
![Home Page](./Home%20Page.png)
![Sample Query](./Sample%20Query.png)

### 🔗 **Useful Links**
- [LlamaIndex Relevance Evaluation Guide](https://docs.llamaindex.ai/en/module_guides/evaluating/usage_pattern.html)  
- [LlamaIndex Relevancy Evaluator](https://docs.llamaindex.ai/en/stable/examples/evaluation/relevancy_eval.html)  
- [Evaluating Search with Human Judgment](https://dtunkelang.medium.com/evaluating-search-using-human-judgement-fbb2eeba37d9)

---

## 🚀 Getting Started  

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-repo/docu-mind.git
cd docu-mind
cd backend
```

### **2️⃣ Install Dependencies**

```sh
pip install -r requirements.txt
```

### **3️⃣ Run the Backend**

```sh
uvicorn main:app --reload
```

### **4️⃣ Start the Frontend**

```sh
cd ../
cd ui-v1
npm install
npm run dev
```

---

## 🎯 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📜 License

MIT License. See `LICENSE` for details.
