# Virtual Memory Simulation
Demonstrate basic virtual memory operation by combining simple paging with page fault handling.

## Features
- Step-by-step logical address translation
- Page and frame table visualization
- Page fault and next-frame highlighting
- Error handling for invalid inputs
- Reset simulation without refreshing

## How to Run

1. **Install dependencies**
```bash
npm install
```

2. **Start Simuation**
```bash
npm run dev
```

3. **Open in Browser**
- Go to http://localhost:5173/
- Enter logical addresses to observe translation and page faults

## How It Works

- Splits logical address into page number and offset
- Checks page table; allocates a frame if page fault occurs
- Generates physical address: Physical Address = Frame × Frame Size + Offset
- Dynamically updates page/frame tables and highlights each step
