# LLM Fallback System Verification

## 1. Summary
The Persona backend now includes a robust fallback mechanism for the LLM engine. This system ensures high availability by automatically switching to a secondary model if the primary model fails or times out. Additionally, a forced fallback mode has been implemented for testing and debugging purposes.

## 2. Model Configuration
The system is configured with the following models (defined in `.env`):
- **Primary Model**: `Qwen/Qwen2.5-7B-Instruct` (High performance, default)
- **Fallback Model**: `mistralai/Mistral-7B-Instruct-v0.2` (Reliable backup)

## 3. Fallback Triggers
The fallback mechanism is triggered in two scenarios:
1.  **Automatic Failure Recovery**: If the primary model raises an exception (e.g., API timeout, overcapacity, or authentication error) during the stream initialization or execution.
2.  **Forced Override**: If the environment variable `FORCE_FALLBACK` is set to `true`.

## 4. Verification Evidence (Logs & Headers)

### A. Logging Pattern
The backend uses Python's structured logging to provide clear visibility into the model selection process.

**Scenario 1: Normal Operation (Primary Success)**
```log
INFO:llm.huggingface_engine:Attempting primary model: Qwen/Qwen2.5-7B-Instruct
INFO:llm.huggingface_engine:Model used: Qwen/Qwen2.5-7B-Instruct
INFO:llm.huggingface_engine:Latency: 1.25s
```

**Scenario 2: Automatic Fallback (Primary Failure)**
```log
INFO:llm.huggingface_engine:Attempting primary model: Qwen/Qwen2.5-7B-Instruct
WARNING:llm.huggingface_engine:Primary model 'Qwen/Qwen2.5-7B-Instruct' failed. Switching to fallback.
WARNING:llm.huggingface_engine:Error details: [Error Message]
INFO:llm.huggingface_engine:Switching to fallback model: 'mistralai/Mistral-7B-Instruct-v0.2'
INFO:llm.huggingface_engine:Model used: mistralai/Mistral-7B-Instruct-v0.2
INFO:llm.huggingface_engine:Latency: 2.10s
```

**Scenario 3: Forced Fallback (Testing)**
```log
WARNING:llm.huggingface_engine:FORCE_FALLBACK is enabled. Skipping primary model.
INFO:llm.huggingface_engine:Model used: mistralai/Mistral-7B-Instruct-v0.2
INFO:llm.huggingface_engine:Latency: 1.15s
```

### B. Response Headers
The `/chat` endpoint now includes a custom header in the `StreamingResponse` to indicate which model was utilized (or intended, in the case of mid-stream failover).

- **Header Name**: `X-Model-Used`
- **Value**: The model ID (e.g., `Qwen/Qwen2.5-7B-Instruct` or `mistralai/Mistral-7B-Instruct-v0.2`)

## 5. Test Procedures

To verify the system safely, follow these procedures:

### Option A: Forced Fallback Test (Safe)
1.  Open `backend/.env`.
2.  Set `FORCE_FALLBACK=true`.
3.  Restart the backend server.
4.  Send a chat message via the frontend.
5.  **Verify**:
    - The response should be generated successfully.
    - Check the terminal logs for the "FORCE_FALLBACK is enabled" warning.
    - Inspect the network request in browser developer tools (Network -> chat -> Headers) to confirm `X-Model-Used` matches the fallback model.

### Option B: Failure Simulation (Advanced)
1.  Open `backend/.env`.
2.  Temporarily change `PRIMARY_MODEL` to an invalid name (e.g., `invalid/model-name`).
3.  Restart the backend server.
4.  Send a chat message.
5.  **Verify**:
    - The system should seamlessly switch to the fallback model.
    - Logs should show "Primary model ... failed" followed by "Switching to fallback".
    - The chat experience should generally remain uninterrupted (though latency might be slightly higher).
6.  **Restore**: Change `PRIMARY_MODEL` back to the correct value.

## 6. Confirmation
- **Streaming Preserved**: The fallback logic is wrapped within the generator, ensuring standard Python `yield from` syntax is used. This preserves the asynchronous streaming behavior of the API regardless of which model is active.
- **Frontend Agnostic**: The frontend requires no changes to support this feature; it simply consumes the stream as usual.
