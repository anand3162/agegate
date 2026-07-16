# AgeGate

**AI-Assisted Age Verification Tool for Retail**

AgeGate is a tablet-based web application for retail staff at alcohol-selling stores. It uses an in-browser AI model to estimate a customer's approximate age from a live camera feed, giving staff an objective, judgment-supporting estimate before they decide whether to request government ID.

The tool does not replace ID checks or staff judgment. It is a decision-support layer that reduces the awkwardness and subjectivity of guessing a stranger's age, while creating a timestamped record that staff followed store policy.

## Status

🚧 Under active development — Day 8 of 20.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| AI / Age Estimation | face-api.js (runs in-browser via TensorFlow.js) |
| Authentication | Firebase Authentication |
| Database | MongoDB |
| Image Storage (testers only) | Firebase Cloud Storage |
| Deployment | Render.com |

## Privacy Note

During this learning phase, AgeGate is tested only with the developer and consenting friends who are fully aware their photo may be captured for development purposes. This tool is never used on real retail customers in this form. See the project spec for the full privacy boundary.

## Setup

1. Clone the repo
2. Go into the backend/ folder
3. Run `npm install`
4. Create a `.env` file with `MONGO_URI=your_connection_string`
5. Run `node index.js`
