
<script>
document.addEventListener("DOMContentLoaded", () => {
    lucide.replace();

    const cards = document.querySelectorAll('.workflow-card');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.6s ease";
        observer.observe(card);
    });
});
</script>

Now your workflow grid doesn’t just sit there. It reveals itself like it has secrets.

If you want to go even harder, we can add: • Animated connection lines between workflow stages
• Live state badges (Running / Approved / Flagged)
• A simulated “workflow engine activity stream” panel

At that point it stops being a landing page and starts being a product preview.
