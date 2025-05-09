# HerBirthday
Birthday of Tran Hue Man(14/5)-2005-2025
# I am Duong Trung Hieu
This is my birthday gift for her<3
Idea:
Absolutely! Here is your comprehensive, organized, and updated requirements and wishes document for your personalized birthday Messenger chat web gift, including the new "crossed-out sentence" feature for Man's replies.
🎉 Birthday Chat Web Gift: Full Requirements and Conditions
1. Project Goal
Create an interactive, Messenger-style web chat app for a friend’s birthday, where users can "message" her two personas, experiencing fully personalized, playful, and humorous group interactions with inside jokes and signature behaviors.
2. Core Experience
Personas to Chat With
Tran Hue Man (her personal self)


Tiem Cuon Len (her shop persona)


Playable Characters
Users sign in as one of 6 close friends:


Ho Phuong Dai


Dau Quang Sang


Phan The Vinh


Duong Trung Hieu


Truong Thi Thu Thao


Nguyen Thanh Dong


Only one can be “signed in” and chatting at a time, but users can sign out and switch to another to see different stories.


Dialogue is 100% personalized
Each friend has custom-written chat scripts for both Man and Shop personas (unique jokes, memories, behaviors).


Dialogue is pre-scripted as choices (no open typing).


3. Messenger-like UI/UX
Familiar Messenger-style layout (avatars, sender/receiver chat bubbles, blue/gray styling).


Avatars for all participants (Man, Shop, each friend).


Message timestamps for realism.


System messages: Shown in chat as italic/different color for events like "Hue Man seen", "Nickname changed", "X hours later", etc.


Typing indicator animation ("...") when personas are preparing a reply (delay is customizable).


Image display:


Shop persona can show product images on request.


Players can send an image to Man; Man rarely replies with images.


No free typing: Users select from preset message options.


4. Special Interactive Features
A. Nickname Changes
Man (or Shop) can instruct users to change their nickname (e.g., “Change your nickname to 60”).


The chat UI updates to show their new nickname.


System message informs the change (*Dau Quang Sang has changed their nickname to 60*).


B. Time System, Seen Status, and Delays
After user messages, system displays "Hue Man seen".


Man’s reply can be delayed-UI shows typing indicator.


Big time jumps in chat are displayed as system messages (e.g., "5 hours later").


Each message/action has a timestamp to track "chat time."


You can customize delays (e.g., reply appears 5 seconds later, timestamp shows hours have passed).


C. Crossed-Out Normal Replies for Man’s Realism
Man's replies can have a "normal" response shown crossed out (strikethrough), followed by her real, characteristic reply.


Example:


text
Hieu: Can I borrow 60k?
Man: ~~What's wrong? Wait for me, I'll let you borrow.~~ Again? Ok.


5. Dialogue Structure and Data Organization
Scripts/ folder with one subfolder for each friend, each containing:


Hue Man.json (dialogue for personal Man)


shop.json (dialogue for shop persona)


Each JSON stores a script tree:


Message text, response options, optional crossed and actual for Man’s replies, actions (e.g., nickname change, time jumps).


Example:

 json
{
  "from": "Man",
  "crossed": "What's wrong? Wait for me, I'll let you borrow.",
  "actual": "Again? ok"
}


Images (avatars, products, etc.) in public/images/avatars/ and public/images/products/.


6. Save Progress (Persistence)
Chat progress, nickname, and state must be saved in browser localStorage so that if a user reloads, they see the same chat and nickname.


Each character’s state is separate.


Optional future: Save to a cloud backend (e.g. Firebase) for cross-device play.


7. Technical & Deployment Requirements
Frontend: React (recommended with Vite or Create React App for simplicity and performance).


No backend necessary for basic version (unless you add cross-device sync later).


Easy web sharing:


Deploy on Vercel or Netlify.


Share a single link; friends just open and play-no install, no downloads required.


Code and assets managed with GitHub for backup and collaboration.


Sample Project Tree
text
birthday-chat-gift/
  Scripts/
    Ho Phuong Dai/
      Hue Man.json
      shop.json
    ...etc.
  public/
    images/
      avatars/
      products/
  src/
    components/
    utils/
    ...
  README.md
  package.json

8. Constraints & Wishes
All content private and lightweight; made for a small group (~6–8 people).


Maximum personalization: Each friend gets their own dialogue, inside jokes, and events.


Messenger-style fun: Nickname changes, time jumps, seen status, crossed-out replies, etc.


No open typing; all choices are clickable options.


Easy for non-tech users: Just open a web link and play.


Maintainable and expandable for future tweaks or jokes.


9. Optional/Future Ideas
Add "export chat history" feature.


Include a birthday wishes art board or photo album.


Easter eggs triggered by certain choices or combos.


Responsive/mobile-friendly UI.


Summary Checklist
Fully personalized, per-friend chat scripts for each persona.


Messenger-style UI, with avatars and system messages.


Nickname change, crossed-out-reply, and time jump support.


Chat saved (localStorage).


No backend required for v1.


Deployed for easy, no-setup web access.


Code organized clearly with folders for each friend’s dialogue.


Simple and fun to play for anyone in your group.


