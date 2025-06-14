<template>
    <body>
        <div class="loading-text">
            <span>通</span>
            <span>禽</span>
            <span>达</span>
            <span>理</span>
        </div>
    </body>
    </template>
    
    <style scoped>
    body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f0f0f0;
        font-family: 'Microsoft YaHei', sans-serif;
    }
    
    .loading-text {
        display: flex;
        gap: 15px;
    }
    
    .loading-text span {
        font-size: 3em;
        font-weight: bold;
        color: #333;
        opacity: 0;
        transform: translateY(20px);
        animation: 
            fadeUp 0.8s ease var(--delay) forwards,
            pulse 1.2s ease calc(var(--delay) + 0.8s) infinite;
    }
    
    @keyframes fadeUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(0) scale(1.1); }
    }
    
    .loading-text span:nth-child(1) { --delay: 0.1s; }
    .loading-text span:nth-child(2) { --delay: 0.3s; }
    .loading-text span:nth-child(3) { --delay: 0.5s; }
    .loading-text span:nth-child(4) { --delay: 0.7s; }
    </style>