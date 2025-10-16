
# Kafkaf Project Roadmap

This document outlines the planned development milestones and feature priorities for Kafkaf. Our primary goals are to establish a **secure, stable, and foundational Web UI** that caters specifically to the .NET community.

## 🚀 Milestone 1: Stabilization & Core Refinement (Immediate/Urgent Focus)

This milestone focuses on essential internal improvements and code quality to ensure a solid foundation before expanding user-facing features. This work is critical for long-term maintainability and security.

| Task | Component | Notes |
| :--- | :--- | :--- |
| **Store Management Refactoring** | Client (Angular) | Deep refactoring of all store management. We are evaluating the introduction of a robust state management solution like NgRx for route and application state. |
| **Unit Test Implementation** | Client & Server | Implement comprehensive unit test coverage for both the Angular frontend and the C\# backend to ensure code stability and prevent regressions. |
| **Topic Editing Enhancement** | Client | Improve the user experience and interface for editing existing topics to align with industry-standard UIs and address current idiosyncrasies. |

---

## 🏗️ Milestone 2: Feature Expansion & Usability (Near Future)

Once the core is stable, this milestone focuses on enhancing core functionality, improving usability, and introducing basic performance metrics.

| Feature | Current Status | Required Enhancement |
| :--- | :--- | :--- |
| **Multi-Cluster Management** | Basic implementation is done. | **Improve Usability:** Focus on better cluster selection, configuration persistence, and overall user flow. |
| **View Kafka Topics** | Mostly done. | **Add Metrics:** Integrate key topic performance metrics and statistics into the topic list and detail views. |
| **View Consumer Groups** | Basic implementation is done. | **Add Offset Lags:** Crucial for monitoring. Implement accurate calculation and display of consumer group offset lags. |
| **Browse Messages** | Basic implementation is done. | **Implement SerDes:** Allow users to specify/configure Serializers/Deserializers to correctly display message keys and values. |
| **Performance Monitoring** | Not started yet. | Implement foundational components for gathering and displaying basic cluster performance data. |
| **Metrics Dashboard** | Not started yet. | Develop an initial dashboard view to summarize key performance indicators. |
| **View Kafka Brokers** | Done. | No immediate changes planned; focus shifts to maintenance. |
| **Dynamic Topic Configuration** | Done. | No immediate changes planned; focus shifts to maintenance. |

---

## 🌟 Milestone 3: Advanced Features & Enterprise Readiness (Someday/Long-Term)

This phase represents advanced functionality necessary for enterprise adoption and full feature parity with mature Kafka UIs. These features will be prioritized based on community interest and available contributor bandwidth.

| Feature Area | Description |
| :--- | :--- |
| **Schema Registry Integration** | Add support for integrating with an external Schema Registry (e.g., Confluent Schema Registry) to validate and correctly display structured data (Avro, Protobuf, etc.). |
| **KSQL Functionality** | Implement a basic KSQL interface for querying stream data directly from the UI. |
| **Authentication** | Implement robust security layers for user authentication (e.g., OAuth2, LDAP integration). |
| **Serde Plugins** | Allow users to load custom SerDe plugins for specialized message formats. |
| **Data Masking** | Implement rules for masking sensitive data in message browsing views based on user roles or configuration. |
| **Role-Based Access Control (RBAC)** | Develop a fine-grained authorization system to control which users can view or modify specific topics and clusters. |
