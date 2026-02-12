<script>
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    lucide.replace();

    // 2. State Badge Configuration
    const states = {
        agreements: { status: 'Running', color: 'bg-accent-emerald' },
        credit: { status: 'Approved', color: 'bg-primary-500' },
        ledger: { status: 'Running', color: 'bg-accent-emerald' },
        tax: { status: 'Flagged', color: 'bg-accent-rose' }
    };

    // Inject Badges
    Object.keys(states).forEach(key => {
        const container = document.getElementById(`badge-${key}`);
        if (container) {
            const dotClass = states[key].status === 'Flagged' ? 'flagged-pulse' : 'pulse-dot';
            container.innerHTML = `
                <div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/50">
                    <span class="w-2 h-2 rounded-full ${states[key].color} ${dotClass}"></span>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-300">${states[key].status}</span>
                </div>
            `;
        }
    });

    // 3. Activity Stream Logic
    const streamContent = document.getElementById('activity-stream-content');
    const activities = [
        { module: 'Credit', msg: 'Score Verified: 785', color: 'text-emerald-400' },
        { module: 'Agreements', msg: 'Contract #8821 Signed', color: 'text-indigo-400' },
        { module: 'Ledger', msg: 'Transaction $1,200.00 Settled', color: 'text-amber-400' },
        { module: 'Tax', msg: 'K-1 Distribution Generated', color: 'text-rose-400' },
        { module: 'Authority', msg: 'Risk Model v4.1 Updated', color: 'text-accent-cyan' }
    ];

    let activityIndex = 0;

    function addActivity() {
        const act = activities[activityIndex];
        const div = document.createElement('div');
        div.className = 'flex items-center gap-3 px-6 whitespace-nowrap animate-slide-in opacity-0';
        div.innerHTML = `
            <span class="text-[10px] font-mono text-slate-500">[${new Date().toLocaleTimeString([], {hour12: false})}]</span>
            <span class="text-xs font-bold uppercase tracking-widest ${act.color}">${act.module}:</span>
            <span class="text-xs text-slate-300">${act.msg}</span>
            <span class="w-1 h-1 rounded-full bg-slate-700"></span>
        `;
        
        streamContent.prepend(div);
        div.style.opacity = '1';
        
        if (streamContent.children.length > 5) {
            streamContent.removeChild(streamContent.lastChild);
        }
        
        activityIndex = (activityIndex + 1) % activities.length;
    }

    setInterval(addActivity, 3000);
    addActivity();

    // 4. Dynamic SVG Connection Lines
    const svg = document.getElementById('connection-svg');
    const cards = document.querySelectorAll('.module-card');

    function drawConnections() {
        svg.innerHTML = ''; // Clear previous lines
        
        for (let i = 0; i < cards.length - 1; i++) {
            const startRect = cards[i].getBoundingClientRect();
            const endRect = cards[i+1].getBoundingClientRect();
            const containerRect = svg.getBoundingClientRect();

            // Calculate center points relative to the SVG container
            const x1 = startRect.right - containerRect.left;
            const y1 = startRect.top + (startRect.height / 2) - containerRect.top;
            const x2 = endRect.left - containerRect.left;
            const y2 = endRect.top + (endRect.height / 2) - containerRect.top;

            // Create an organic path (curved line)
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const controlPointX = x1 + (x2 - x1) / 2;
            const d = `M ${x1} ${y1} C ${controlPointX} ${y1}, ${controlPointX} ${y2}, ${x2} ${y2}`;
            
            path.setAttribute("d", d);
            path.setAttribute("class", "connection-line");
            svg.appendChild(path);
        }
    }

    // Initial draw and redraw on resize
    setTimeout(drawConnections, 100);
    window.addEventListener('resize', drawConnections);

    // 5. Intersection Observer for Reveal
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                entry.target.style.opacity = 1;
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = 0;
        observer.observe(card);
    });
});
</script>
