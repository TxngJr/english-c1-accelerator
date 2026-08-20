# KMITL OpenAI-Compatible API Setup

This project can use the KMITL AI gateway instead of calling OpenAI directly.

## 1. Create `.env.local`

Copy `.env.example` to `.env.local` and add the real student token locally:

```env
AI_API_KEY=your-real-kmitl-token
AI_BASE_URL=https://api.ai.kmitl.ac.th/v1
AI_MODEL_PREFIX=openrouter/
```

Never commit `.env.local` or a real API token. `.gitignore` already ignores `.env*` except `.env.example`.

## 2. Chat model selection

KMITL requires `openrouter/` as the prefix for model names. The application automatically adds that prefix to explicitly configured model ids when necessary.

You may either set an exact model id:

```env
AI_CHAT_MODEL=openrouter/<exact-model-id>
```

or leave `AI_CHAT_MODEL` blank. When it is blank, the server queries:

```text
GET https://api.ai.kmitl.ac.th/v1/models
Authorization: Bearer <token>
```

and tries the KMITL-recommended families in this order:

1. Deepseek v4 Flash
2. Kimi K3
3. Grok 4.6

Matching uses both the model `id` and optional `name`, so the app does not need to guess the exact provider slug from a display name.

Purpose-specific overrides are also supported:

```env
AI_FEEDBACK_MODEL=
AI_CONVERSATION_MODEL=
```

If these are blank, `AI_CHAT_MODEL` or auto-discovery is used.

## 3. API endpoint compatibility

Speaking feedback and Conversation Coach use the broadly supported OpenAI-compatible endpoint:

```text
POST /chat/completions
```

The application no longer depends on OpenAI's provider-specific Responses API for these features.

## 4. Speech-to-text

Browser Speech Recognition remains the default free/local path when the browser supports it. Manual transcript correction is always available.

Cloud STT is optional. Configure it only when the KMITL gateway exposes a model compatible with:

```text
POST /audio/transcriptions
```

Then set:

```env
AI_TRANSCRIPTION_MODEL=openrouter/<compatible-transcription-model-id>
```

If no transcription model is configured, or if the gateway does not expose `/audio/transcriptions`, the app returns a clear fallback message and continues to support Browser STT/manual transcription. It does not fall back to `api.openai.com`.

## 5. Security

- Keep `AI_API_KEY` server-side only.
- Never use `NEXT_PUBLIC_AI_API_KEY`.
- Never paste a real key into source code, tests, README files, screenshots, issues, commits, or pull-request descriptions.
- For public deployment, add authentication and rate limiting before allowing untrusted users to call paid AI routes.
- The KMITL monthly quota should be treated as limited study budget; use Browser STT and local metrics where they are sufficient.

## 6. Recommended study usage

Use cloud tokens where they add the most learning value:

- Speaking Coach language feedback after a serious recorded attempt
- Conversation Coach adaptive follow-up questions at B1-C1
- complex correction/coherence feedback

Do not spend API budget on tasks already handled reliably by local metrics, normal lesson checking, or browser speech recognition.
