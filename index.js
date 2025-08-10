class BlockchainWall {
    constructor() {
        this.svg = d3.select('#wallCanvas');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.time = 0;
        this.lightSource = { x: this.width * 0.7, y: this.height * 0.3 };
        
        this.init();
        this.createPolygons();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    init() {
        this.svg
            .attr('width', this.width)
            .attr('height', this.height);
    }
    
    createPolygons() {
        const polygons = [];
        const gridSize = 50;
        const cols = Math.ceil(this.width / gridSize) + 1;
        const rows = Math.ceil(this.height / gridSize) + 1;
        
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const centerX = x * gridSize + 25;
                const centerY = y * gridSize + 25;
                
                const polygon = {
                    id: `poly-${x}-${y}`,
                    centerX,
                    centerY,
                    baseSize: 15 + Math.random() * 10,
                    phase: Math.random() * Math.PI * 2,
                    breathSpeed: 0.05 + Math.random() * 0.1,
                    waveSpeed: 0.02 + Math.random() * 0.05,
                    points: this.generateHexagon(centerX, centerY, 20)
                };
                
                polygons.push(polygon);
            }
        }
        
        this.polygonGroup = this.svg.append('g').attr('class', 'polygon-group');
        
        this.polygons = this.polygonGroup
            .selectAll('polygon')
            .data(polygons)
            .enter()
            .append('polygon')
            .attr('points', d => d.points)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(0, 255, 65, 0.3)')
            .attr('stroke-width', 0.8)
            .attr('opacity', 1);
            
        this.polygonData = polygons;
    }
    
    generateHexagon(cx, cy, size) {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = cx + size * Math.cos(angle);
            const y = cy + size * Math.sin(angle);
            points.push(`${x},${y}`);
        }
        return points.join(' ');
    }
    
    updatePolygons() {
        this.time += 0.1;  
        
        this.lightSource.x = this.width * 0.5 + Math.sin(this.time * 0.02) * this.width * 0.4;
        this.lightSource.y = this.height * 0.5 + Math.cos(this.time * 0.015) * this.height * 0.3;
        
        this.polygons
            .attr('points', (d, i) => {
                const breathe = Math.sin(this.time * d.breathSpeed + d.phase) * 12;
                
                const wave1 = Math.sin(d.centerX * 0.02 + this.time * d.waveSpeed) * 8;
                const wave2 = Math.cos(d.centerY * 0.015 + this.time * d.waveSpeed * 0.7) * 6;
                
                const centerDist = Math.sqrt(
                    Math.pow(d.centerX - this.width/2, 2) + 
                    Math.pow(d.centerY - this.height/2, 2)
                );
                const ebb = Math.sin(this.time * 0.03 + centerDist * 0.01) * 5;
                
                const currentSize = Math.max(5, d.baseSize + breathe + wave1 + wave2 + ebb);
                return this.generateHexagon(d.centerX, d.centerY, currentSize);
            })
            .attr('stroke', (d) => {
                const distance = Math.sqrt(
                    Math.pow(d.centerX - this.lightSource.x, 2) + 
                    Math.pow(d.centerY - this.lightSource.y, 2)
                );
                
                const maxDistance = this.width * 0.6;
                const lightIntensity = Math.max(0.1, 1 - distance / maxDistance);
                
                const connectivity = Math.sin(this.time * 0.08 + d.phase) * 0.5 + 0.5;
                
                const alpha = lightIntensity * connectivity * 0.8;
                return `rgba(0, 255, 65, ${alpha})`;
            })
            .attr('fill', (d) => {
                const distance = Math.sqrt(
                    Math.pow(d.centerX - this.lightSource.x, 2) + 
                    Math.pow(d.centerY - this.lightSource.y, 2)
                );
                
                if (distance < 250) {
                    const fillAlpha = (250 - distance) / 250 * 0.15;
                    return `rgba(0, 255, 65, ${fillAlpha})`;
                }
                return 'none';
            });
    }
    
    animate() {
        this.updatePolygons();
        requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.svg
            .attr('width', this.width)
            .attr('height', this.height);
        
        this.svg.selectAll('.polygon-group').remove();
        this.createPolygons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    if (typeof d3 === 'undefined') {
        console.error('D3 is not loaded!');
        return;
    }
    
    setTimeout(() => {
        new BlockchainWall();
    }, 200);
}); 