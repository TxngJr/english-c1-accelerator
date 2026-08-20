# KMITL OpenAI-Compatible API Setup

This project uses the KMITL AI gateway instead of calling OpenAI directly.

## 1. Create `.env.local`

Copy `.env.example` to `.env.local` and add the real student token locally:

```env
AI_API_KEY=your-real-kmitl-token
AI_BASE_URL=https://api.ai.kmitl.ac.th/v1
AI_MODEL_PREFIX=openrouter/
AI_CHAT_MODEL=
```

Never commit `.env.local` or a real API token. `.gitignore` already ignores `.env*` except `.env.example`.

## 2. Strongest-available chat model selection

KMITL requires `openrouter/` as the prefix for model names. The application automatically adds that prefix to explicitly configured model ids when necessary.

For normal use, leave `AI_CHAT_MODEL` blank. The server asks the authenticated gateway for the models that this token can actually use:

```text
GET https://api.ai.kmitl.ac.th/v1/models
Authorization: Bearer <token>
```

It then ranks only models that appear in that response. This prevents the app from assuming that a model is available merely because it exists publicly.

The capability-oriented ranking currently recognizes these high-end families in this order:

1. GPT-5.6 Sol, when the KMITL gateway actually exposes it
2. Claude Fable 5, when exposed
3. Grok 4.6
4. Kimi K3
5. DeepSeek V4 Pro
6. DeepSeek V4 Flash

For the teacher-provided recommended set of Grok 4.6, Kimi K3 and DeepSeek V4 Flash, the app therefore selects **Grok 4.6** when that model is returned for the token.

The selected model is cached for 10 minutes to avoid wasting quota/model-list requests. You can inspect the safe runtime result at:

```text
GET /api/ai-provider/status
```

That endpoint never returns the API token. It reports whether KMITL AI is configured, which model was selected and whether selection was explicit or automatic.

If KMITL later adds a model that is not in the ranking table and you know it should be preferred, set its exact id explicitly:

```env
AI_CHAT_MODEL=openrouter/<exact-model-id>
```

Purpose-specific overrides remain supported:

```env
AI_FEEDBACK_MODEL=
AI_CONVERSATION_MODEL=
```

If they are blank, feedback and Conversation Coach use `AI_CHAT_MODEL` or strongest-available auto-selection.

## 3. API endpoint compatibility

Speaking feedback and Conversation Coach use the broadly supported OpenAI-compatible endpoint:

```text
POST /chat/completions
```

The application does not call `api.openai.com` for these features.

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

If no transcription model is configured, or if the gateway does not expose `/audio/transcriptions`, the app returns a clear fallback message and continues to support Browser STT/manual transcription. It never falls back to `api.openai.com`.

## 5. Security

- Keep `AI_API_KEY` server-side only.
- Never use `NEXT_PUBLIC_AI_API_KEY`.
- Never paste a real key into source code, tests, README files, screenshots, issues, commits, or pull-request descriptions.
- For public deployment, add authentication and rate limiting before allowing untrusted users to call paid AI routes.
- The KMITL monthly quota should be treated as limited study budget; use Browser STT and local metrics where they are sufficient.

## 6. Recommended study usage

Spend cloud tokens where a stronger model materially improves learning:

- detailed Speaking Coach language feedback after a serious recorded attempt
- adaptive Conversation Coach follow-up questions, especially B1-C1
- coherence, reformulation, nuance and error-pattern feedback

Do not spend API budget on tasks already handled reliably by local metrics, normal lesson checking, or browser speech recognition.
