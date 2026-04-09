# Security Notes

- No hardcoded secrets.
- Credentials are optional and primarily for user convenience; session reuse is preferred.
- Sensitive operations centralized in storage + adapter modules.
- Diagnostics export applies simple password redaction.
- Raw credentials are not written to logs.
- Mobile-profile records are excluded from sync ingestion signals.
- For stronger protection, move secret material to native messaging host + OS keychain (future hardening).
