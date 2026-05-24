import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-api-docs',
  imports: [CommonModule],
  templateUrl: './api-docs.html',
  styleUrls: ['./api-docs.css'],
})
export class ApiDocs {
  apiUrl = 'http://localhost:5000';
  
  curlExample = `curl -X POST http://localhost:5000/events \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <token>" \\
  -d '{
    "application": "my-app",
    "message": "Database connection failed",
    "severity": "critical",
    "environment": "production",
    "event_type": "error",
    "source": "backend"
  }'`;

  javascriptExample = `const token = '<token>';
const event = {
  application: "my-app",
  message: "Database connection failed",
  severity: "critical",
  environment: "production",
  event_type: "error",
  source: "backend"
};

fetch('http://localhost:5000/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify(event)
})
.then(r => r.json())
.then(data => console.log('Event logged:', data));`;

  pythonExample = `import requests

token = '<token>'

event = {
    "application": "my-app",
    "message": "Database connection failed",
    "severity": "critical",
    "environment": "production",
    "event_type": "error",
    "source": "backend"
}

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.post('http://localhost:5000/events', json=event, headers=headers)
print(response.json())`;
  copied = false;

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.copied = true;
    setTimeout(() => { this.copied = false; }, 2000);
  }
}
