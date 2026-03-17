```
[Unit]
Description=My Binary Service

[Service]
WorkingDirectory=/your/working/directory
ExecStart=/path/to/your/binary
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
