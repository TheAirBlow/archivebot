# ArchiveBot
This bot audits channels and archives them when deleted.
It is intented to be self-hosted, beacuse global bot wouldn't save so much messages.

## Commands
* [+] a!ping: Ping
* [+] a!reload: Reloads commands
* [-] a!help: Shows all commands
* [+] a!audit: Audit settings
    * [+] a!audit add: Adds current channel for audit
    * [+] a!audit remove: Removes current channel from audit
    * [+] a!audit max <count>: Set max messages to save in audit
    * [+] a!audit deleted: Audit deleted messages
    * [+] a!audit edits: Audit edits
    * [+] a!audit bots: Audit bot messages
    * [+] a!audit clear: Clears audit from this channel
    * [+] a!audit list: Shows last 15 audit records
    * [+] a!audit data <id>: Shows data for message ID
    * [+] a!audit last: Shows data for last message
* [+] a!archive: Archive setings/actions
    * [+] a!archive auto: Auto archive deleted channels
    * [+] a!archive channel: Archives this channel
    * [+] a!archive list: List archived channels
    * [+] a!archive data <id>: Get archive of channel
* [+] a!prefix <prefix>: Changes prefix

## Config
You just need to configure token here, everything other can be configured using commands.
```json
{
    "token": "token-here",
    "prefix": "a!",
    "report": {
        "delete": true,
        "edit": false
    },
    "audit": {
        "auditDeletedMessages": true,
        "auditEdits": true,
        "auditBotMessages": true,
        "maxMessages": "100"
    },
    "archive": {
        "autoArchiveOnDelete": true
    }
}
```