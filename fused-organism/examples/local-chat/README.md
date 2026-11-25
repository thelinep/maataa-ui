# MAATAA local chat

A chat app that runs on your computer and talks to a local model (Ollama or LM Studio). Nothing leaves the machine unless you point it at another server.

- **Projects:** each has its own chats, instructions and text files (scripts, notes, lists). For each question the closest passages from the files are sent to the model and shown as sources. The built-in **MAATAA UI docs** project answers questions about this library.
- **Artifacts:** when a reply contains a page (` ```html `, ` ```svg `), a titled document (` ```markdown title="Shoot plan" `) or long code, it shows as a card and opens in the side panel, with versions, Copy and Download. Pages run in a sandboxed frame with no access to the app.
- **Tasks:** checklists in a reply (`- [ ] Book the van`) can be added with one tap; `/task` adds one by hand. Optionally copied to the Radheya board in Maataa Workstation.
- **Pictures:** attach, paste or drop up to 4 pictures. Needs a model that can see (gemma3, llava, qwen2.5vl).
- **Rich replies:** Markdown, tables, charts, tap-to-answer options, and MAATAA call sheets, shot lists, crew cards and Vikram Samvat dates.
- **Voice:** Read aloud on each reply; the microphone button types what you say (browser speech, where available).

Everything is kept in this browser (IndexedDB). Hindi and English.

```sh
ollama pull gemma3        # once; any chat model works, this one can also see pictures
npm run chat:local        # from fused-organism; opens http://127.0.0.1:5180
```

Optional: start Maataa Workstation (nova-console on port 8787), then turn on **Settings → Copy tasks to its Radheya board**. Use `NOVA_URL` if it runs elsewhere. Workstation has no place for projects, chats or artifacts yet, so those stay in the browser.

See [docs/LOCAL-CHAT.md](../../docs/LOCAL-CHAT.md) for options, the component API and security notes.
