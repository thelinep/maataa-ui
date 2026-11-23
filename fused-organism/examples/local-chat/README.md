# MAATAA local chat

A chat app that runs on your computer and talks to a local model (Ollama or LM Studio). It has two modes:

- **Chat:** a free conversation.
- **MAATAA UI docs:** answers questions about this library from its own source and guides, and lists its sources.

```sh
ollama pull llama3.2      # once
npm run chat:local        # from fused-organism; opens http://127.0.0.1:5180
```

See [docs/LOCAL-CHAT.md](../../docs/LOCAL-CHAT.md) for options, the component API and security notes.
