# Camel Learning Tool

## Overview
Camel Learning Tool, a master's thesis project at the Faculty of Informatics, Masaryk University. This interactive application aids in practicing and learning about Camel routes and integration. It utilizes the TNB project to deploy various services, thereby creating a comprehensive integration environment.

## Features
- Interactive tutorials on Camel components and Enterprise Integration Patterns (EIPs).
- Integration with the TNB project for service deployment.
- Hands-on environment for mastering Camel route and integration.

## Installation and Deployment

### Getting Started
The Camel Learning Tool is designed for straightforward setup and execution.

#### Prerequisites
- Latest version of [Quarkus](https://quarkus.io/).
- Before deployment, the following are required:
- TNB Framework: Download and build instructions available [here]([#](https://github.com/tnb-software/TNB)).
- Access to Red Hat's internal image hub (requires Red Hat login).

**Note:** These requirements are mostly for setting up a complete environment. If you face deployment issues, please ensure these prerequisites are met.

#### Running the Application
Head to the camel-backend directory and rune one of the following commands:

- **Development Mode:** 
  ```bash
  quarkus dev
  ```
- **Production Mode:** 
  ```bash
  quarkus build
  ```
or corresponding mvn or mvnw commands.
The application will be ready on port 8080

  
