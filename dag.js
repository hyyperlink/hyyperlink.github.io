class DAGVisualizer {
    constructor() {
        this.svg = d3.select('#dag-background');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.svg
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .style('position', 'fixed')
            .style('top', 0)
            .style('left', 0);

        const area = this.width * this.height;
        this.nodeCount = Math.min(Math.max(Math.floor(area / 35000), 40), 120);

        this.nodes = [];
        this.links = [];
        
        this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.id)
                .distance(300)
                .strength(0.1))
            .force('charge', d3.forceManyBody()
                .strength(-100)
                .distanceMax(500))
            .force('x', d3.forceX(this.width / 2).strength(0.01))
            .force('y', d3.forceY(this.height / 2).strength(0.01))
            .alphaDecay(0.01);

        this.initialize();
        this.setupResizeHandler();
    }

    initialize() {
        this.nodes = Array.from({ length: this.nodeCount }, (_, i) => ({
            id: i,
            x: this.width * 0.1 + Math.random() * this.width * 0.8,
            y: this.height * 0.1 + Math.random() * this.height * 0.8,
            z: Math.random() * 200 - 100,
            velocity: Math.random() * 0.3 + 0.2,
            zVelocity: (Math.random() * 2 - 1) * 0.7
        }));

        this.links = [];
        for (let i = 0; i < this.nodes.length; i++) {
            if (Math.random() < 0.7) {
                const targetIdx = Math.floor(Math.random() * (this.nodes.length - i - 1)) + i + 1;
                if (targetIdx < this.nodes.length) {
                    this.links.push({
                        source: this.nodes[i].id,
                        target: targetIdx
                    });
                }
            }
        }

        this.draw();
    }

    draw() {
        this.svg.selectAll('*').remove();

        const links = this.svg.append('g')
            .selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('stroke', '#444')
            .attr('stroke-width', 1);

        const nodes = this.svg.append('g')
            .selectAll('circle')
            .data(this.nodes)
            .enter()
            .append('circle')
            .attr('r', d => this.getNodeSize(d.z))
            .attr('fill', '#555');

        this.simulation
            .nodes(this.nodes)
            .on('tick', () => {
                links
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y)
                    .attr('opacity', d => this.getLinkOpacity(d.source.z, d.target.z));

                nodes
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
                    .attr('r', d => this.getNodeSize(d.z))
                    .attr('opacity', d => this.getNodeOpacity(d.z));
            });

        this.simulation.force('link').links(this.links);
        this.animate();
    }

    getNodeSize(z) {
        const scale = (z + 100) / 200;
        return 2 * (0.2 + scale);
    }

    getNodeOpacity(z) {
        const scale = (z + 100) / 200;
        return 0.1 + scale * 0.7;
    }

    getLinkOpacity(z1, z2) {
        return (this.getNodeOpacity(z1) + this.getNodeOpacity(z2)) / 2 * 0.2;
    }

    animate() {
        let time = 0;
        let lastFrame = 0;
        const frameInterval = 1000 / 30;

        const animate = (currentTime) => {
            if (currentTime - lastFrame < frameInterval) {
                requestAnimationFrame(animate);
                return;
            }

            lastFrame = currentTime;
            time += 0.002;
            
            this.nodes.forEach(node => {
                const dx = Math.sin(time + node.x * 0.01) * 1.5;
                const dy = Math.cos(time + node.y * 0.01) * 1.5;
                
                node.x += dx * node.velocity;
                node.y += dy * node.velocity;
                node.z += node.zVelocity * 0.6;

                if (node.z > 100) {
                    node.z = -100;
                    node.x = this.width * 0.1 + Math.random() * this.width * 0.8;
                    node.y = this.height * 0.1 + Math.random() * this.height * 0.8;
                } else if (node.z < -100) {
                    node.z = 100;
                    node.x = this.width * 0.1 + Math.random() * this.width * 0.8;
                    node.y = this.height * 0.1 + Math.random() * this.height * 0.8;
                }

                if (node.x < -200) node.x = this.width + 200;
                if (node.x > this.width + 200) node.x = -200;
                if (node.y < -200) node.y = this.height + 200;
                if (node.y > this.height + 200) node.y = -200;
            });

            this.simulation.alpha(0.1).restart();
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.svg.attr('viewBox', `0 0 ${this.width} ${this.height}`);
                const area = this.width * this.height;
                this.nodeCount = Math.min(Math.max(Math.floor(area / 35000), 40), 120);
                this.initialize();
            }, 250);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DAGVisualizer();
}); 