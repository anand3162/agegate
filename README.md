# AgeGate

**AI-Assisted Age Verification Tool for Retail**

AgeGate is a tablet-based web application for retail staff at alcohol-selling stores. It uses an in-browser AI model to estimate a customer's approximate age from a live camera feed, giving staff an objective, judgment-supporting estimate before they decide whether to request government ID.

The tool does not replace ID checks or staff judgment. It is a decision-support layer that reduces the awkwardness and subjectivity of guessing a stranger's age, while creating a timestamped record that staff followed store policy.

## Status

🚧 Under active development — Day 1 of 20.

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

_Setup instructions will be added as the project is built out._
