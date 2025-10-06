# Synthetic Health Data Specification

## Features
1. Heart Rate (bpm) – 60–100 normal, spikes for stress, brady/tachy events
2. SpO₂ (%) – 95–100 normal, drops below 92 for events
3. Temperature (°C) – 36.1–37.2 normal, spikes for fever
4. Steps / Activity – 0–120 steps/min, random bursts
5. Hydration (0–1) – decreases with steps, restores with drink events
6. Fatigue Risk (0–1) – derived from HR, SpO₂, Hydration

## Sampling
- Every 3–5 seconds
- Sequence length: 20–30 readings for ML input
- Total simulated points: 5000–10000

## Simulation Patterns
- HR: circadian rhythm + random spikes
- SpO₂: baseline 98%, occasional dips
- Temp: baseline 36.5°C, activity + fever events
- Steps: sine wave + random bursts
- Hydration: decrease with activity, restore randomly
- Fatigue Risk: formula-based, noise added
