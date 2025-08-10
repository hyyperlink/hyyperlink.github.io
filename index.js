class GeometricCanvas {
    constructor() {
        this.canvas = document.getElementById('geometryCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.time = 0;
        
        this.init();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const numParticles = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                life: Math.random(),
                maxLife: 0.3 + Math.random() * 0.7,
                phase: Math.random() * Math.PI * 2,
                size: 1 + Math.random() * 2,
                connections: []
            });
        }
    }
    
    updateParticles() {
        this.time += 0.01;
        
        this.particles.forEach((particle, index) => {
            // Organic movement with Conway's Game of Life inspired rules
            const neighbors = this.getNeighbors(particle, 60);
            const neighborCount = neighbors.length;
            
            // Cellular automata-like behavior rules
            if (neighborCount < 2) {
                particle.life -= 0.003; // Underpopulation
            } else if (neighborCount === 2 || neighborCount === 3) {
                particle.life += 0.001; // Survival
            } else {
                particle.life -= 0.002; // Overpopulation
            }
            
            // Smooth movement influenced by neighbors
            let avgX = 0, avgY = 0;
            neighbors.forEach(neighbor => {
                avgX += neighbor.x;
                avgY += neighbor.y;
            });
            
            if (neighbors.length > 0) {
                avgX /= neighbors.length;
                avgY /= neighbors.length;
                
                const attraction = 0.002;
                particle.vx += (avgX - particle.x) * attraction;
                particle.vy += (avgY - particle.y) * attraction;
            }
            
            // Add subtle wave motion
            particle.vx += Math.sin(this.time + particle.phase) * 0.001;
            particle.vy += Math.cos(this.time + particle.phase * 1.3) * 0.001;
            
            // Apply velocity damping
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary wrapping
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Life cycle management
            particle.life = Math.max(0, Math.min(particle.maxLife, particle.life));
            
            if (particle.life <= 0 && Math.random() < 0.01) {
                // Respawn with new properties
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
                particle.life = Math.random() * 0.3;
                particle.phase = Math.random() * Math.PI * 2;
            }
        });
    }
    
    getNeighbors(particle, radius) {
        return this.particles.filter(other => {
            if (other === particle) return false;
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            return Math.sqrt(dx * dx + dy * dy) < radius;
        });
    }
    
    drawConnections() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 0.5;
        
        this.particles.forEach(particle => {
            if (particle.life > 0.1) {
                const neighbors = this.getNeighbors(particle, 80);
                neighbors.forEach(neighbor => {
                    if (neighbor.life > 0.1) {
                        const dx = particle.x - neighbor.x;
                        const dy = particle.y - neighbor.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const alpha = (1 - distance / 80) * 0.1 * particle.life * neighbor.life;
                        
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(neighbor.x, neighbor.y);
                        this.ctx.stroke();
                    }
                });
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            if (particle.life > 0) {
                const alpha = particle.life * 0.3;
                const size = particle.size * (0.5 + particle.life);
                
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Add subtle glow
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
                this.ctx.shadowBlur = size * 2;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, size * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        });
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        this.drawParticles();
    }
    
    animate() {
        this.updateParticles();
        this.render();
        requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GeometricCanvas();
}); 