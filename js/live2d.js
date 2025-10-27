// Live2D integration using pixi-live2d-display
class Live2DCharacter {
    constructor() {
        this.app = null;
        this.model = null;
        this.canvas = document.getElementById('live2d-canvas');
        this.commentElement = document.getElementById('live2d-comment');
        this.commentTimeout = null;
        this.baseScale = 1;

        this.motionGroups = [
            'Tap',
            'Tap@Body',
            'Flick',
            'FlickUp',
            'FlickDown'
        ];

        this.comments = [
            'こんにちは〜！',
            'シェルコマンド、頑張って！',
            '今日も一日お疲れ様！',
            'セキュリティ大事だよ〜',
            'カッコいいコマンドだね！',
            'ペンテスト頑張って〜',
            'リバースシェル〜？',
            'エシカルハッキング♪',
            'CTF楽しいよね！',
            'コードの世界へようこそ！',
            '今日の調子はどう？',
            '一緒に勉強しよう〜',
            '素敵なツールだね！',
            'セキュリティ研究者？',
            'ホワイトハッカー応援中！'
        ];

        this.init();
    }

    async init() {
        if (!this.canvas || !window.PIXI || !PIXI.live2d) {
            console.error('Live2D dependencies are not ready.');
            return;
        }

        try {
            // Initialize PIXI Application
            this.app = new PIXI.Application({
                view: this.canvas,
                width: 560,
                height: 760,
                transparent: true,
                antialias: true,
                resolution: Math.max(window.devicePixelRatio || 1, 2),
                autoDensity: true
            });

            // Register ticker properly
            let sharedTicker = null;
            if (PIXI.Ticker) {
                PIXI.live2d.Live2DModel.registerTicker?.(PIXI.Ticker);
                sharedTicker = PIXI.Ticker.shared;
            } else if (PIXI.ticker && PIXI.ticker.Ticker) {
                PIXI.live2d.Live2DModel.registerTicker?.(PIXI.ticker.Ticker);
                sharedTicker = PIXI.ticker.shared || PIXI.ticker.Ticker.shared;
            }

            if (!sharedTicker) {
                console.warn('Live2D: no shared ticker detected, creating manual ticker for animations.');
                const ManualTickerClass = PIXI.Ticker || (PIXI.ticker && PIXI.ticker.Ticker);
                sharedTicker = ManualTickerClass ? new ManualTickerClass() : {
                    add: () => {},
                    remove: () => {},
                    start: () => {}
                };
                PIXI.live2d.Live2DModel.registerTicker?.({
                    shared: sharedTicker
                });
            }

            if (typeof sharedTicker.start === 'function') {
                sharedTicker.start();
            }

            PIXI.live2d.config = PIXI.live2d.config || {};
            PIXI.live2d.config.ticker = sharedTicker;

            console.log('Attempting to load Live2D model...');

            // Try to load the model
            this.model = await PIXI.live2d.Live2DModel.from('assets/live2d/models/hiyori_pro/hiyori_pro_t11.model3.json');

            if (!this.model) {
                throw new Error('Model failed to load');
            }

            this.model.interactive = true;
            this.model.buttonMode = true;

            this.app.stage.addChild(this.model);

            this.fitModelToCanvas();
            this.setupInteractions();
            this.playIdleMotion();

            console.log('Live2D model loaded successfully');
        } catch (error) {
            console.error('Failed to initialise Live2D model:', error);
            console.log('Falling back to simple character...');
            // Fall back to simple character
            this.initSimpleCharacter();
        }
    }

    initSimpleCharacter() {
        const simpleCharacter = new SimpleCharacter();
        // Remove this app since we're switching to simple character
        if (this.app) {
            this.app.destroy();
            this.app = null;
        }
    }

    fitModelToCanvas() {
        if (!this.model || !this.app) return;

        const { renderer } = this.app;
        const container = document.getElementById('live2d-container');
        if (!container) return;

        const rect = container.getBoundingClientRect();
        renderer.resize(rect.width, rect.height);

        const targetWidth = rect.width;
        const targetHeight = rect.height;

        // Reset scale before measuring so calculations stay stable across interactions
        this.model.scale.set(1);

        // Use the model's current bounds instead of non-existent original width/height
        const bounds = this.model.getLocalBounds();
        const modelWidth = bounds.width || 1;
        const modelHeight = bounds.height || 1;

        const scaleX = targetWidth / modelWidth;
        const scaleY = targetHeight / modelHeight;
        const scale = Math.min(scaleX, scaleY) * 1.7;

        this.baseScale = scale;
        this.model.scale.set(scale);
        this.model.anchor.set(0.5, 0.9);
        const horizontalShift = targetWidth * 0.2;
        this.model.position.set((targetWidth / 2) - horizontalShift, targetHeight * 1.55);
    }

    setupInteractions() {
        if (!this.model) return;

        this.model.on('pointerdown', () => this.onInteraction());
    }

    onInteraction() {
        this.playRandomMotion();
        this.showRandomComment();
    }

    playIdleMotion() {
        if (!this.model) return;
        this.model.motion('Idle').catch((err) => {
            console.error('Failed to play idle motion:', err);
        });
    }

    playRandomMotion() {
        if (!this.model) return;

        const available = this.motionGroups.filter((group) => this.model.internalModel?.motionManager?.clips.has(group));
        const candidates = available.length ? available : this.motionGroups;
        const group = candidates[Math.floor(Math.random() * candidates.length)];

        this.model.motion(group).catch((err) => {
            console.error(`Failed to play motion "${group}":`, err);
        });
    }

    showRandomComment() {
        const message = this.comments[Math.floor(Math.random() * this.comments.length)];
        this.showComment(message);
    }

    showComment(message) {
        if (!this.commentElement) return;

        this.commentElement.textContent = message;
        this.commentElement.classList.add('show');

        if (this.commentTimeout) {
            clearTimeout(this.commentTimeout);
        }

        this.commentTimeout = setTimeout(() => {
            this.commentElement.classList.remove('show');
        }, 3000);
    }

    handleResize() {
        this.fitModelToCanvas();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let attempts = 0;
    const maxAttempts = 50;

    const waitForLibraries = () => {
        console.log(`Attempt ${attempts + 1}: Checking Live2D libraries...`);
        console.log('PIXI available:', !!window.PIXI);
        console.log('PIXI.live2d available:', !!(window.PIXI && PIXI.live2d));
        console.log('Live2DModel.from available:', !!(window.PIXI && PIXI.live2d && typeof PIXI.live2d.Live2DModel?.from === 'function'));

        const ready = window.PIXI && PIXI.live2d && typeof PIXI.live2d.Live2DModel?.from === 'function';

        if (ready) {
            console.log('Live2D libraries ready, initializing character...');
            const live2dCharacter = new Live2DCharacter();
            window.addEventListener('resize', () => live2dCharacter.handleResize());
            return;
        }

        attempts += 1;
        if (attempts <= maxAttempts) {
            setTimeout(waitForLibraries, 300);
        } else {
            console.error('Live2D libraries failed to load after', maxAttempts, 'attempts');
            console.log('Falling back to simple character...');
            initSimpleCharacter();
        }
    };

    // Fallback to simple character if Live2D fails
    const initSimpleCharacter = () => {
        const character = new SimpleCharacter();
        window.addEventListener('resize', () => character.handleResize());
    };

    waitForLibraries();
});

// Simple fallback character using PIXI.js only
class SimpleCharacter {
    constructor() {
        this.app = null;
        this.character = null;
        this.canvas = document.getElementById('live2d-canvas');
        this.commentElement = document.getElementById('live2d-comment');
        this.isInitialized = false;

        this.comments = [
            'こんにちは〜！',
            'シェルコマンド、頑張って！',
            '今日も一日お疲れ様！',
            'セキュリティ大事だよ〜',
            'カッコいいコマンドだね！',
            'ペンテスト頑張って〜',
            'リバースシェル〜？',
            'エシカルハッキング♪',
            'CTF楽しいよね！',
            'コードの世界へようこそ！',
            '今日の調子はどう？',
            '一緒に勉強しよう〜',
            '素敵なツールだね！',
            'セキュリティ研究者？',
            'ホワイトハッカー応援中！'
        ];

        this.init();
    }

    async init() {
        if (!window.PIXI) {
            console.error('PIXI.js not available');
            return;
        }

        try {
            this.app = new PIXI.Application({
                view: this.canvas,
                width: 560,
                height: 760,
                transparent: true,
                resolution: Math.max(window.devicePixelRatio || 1, 2),
                autoDensity: true
            });

            this.createCharacter();
            this.setupInteractions();
            this.startIdleAnimation();

            this.isInitialized = true;
            console.log('Simple character initialized successfully');
        } catch (error) {
            console.error('Failed to initialize simple character:', error);
        }
    }

    createCharacter() {
        this.character = new PIXI.Container();

        // Create simple anime-style character
        const head = new PIXI.Graphics();
        head.beginFill(0xFFDBB5);
        head.drawCircle(0, 0, 40);
        head.endFill();
        head.x = 100;
        head.y = 80;

        const leftEye = new PIXI.Graphics();
        leftEye.beginFill(0x000000);
        leftEye.drawEllipse(0, 0, 8, 12);
        leftEye.endFill();
        leftEye.x = 85;
        leftEye.y = 75;

        const rightEye = new PIXI.Graphics();
        rightEye.beginFill(0x000000);
        rightEye.drawEllipse(0, 0, 8, 12);
        rightEye.endFill();
        rightEye.x = 115;
        rightEye.y = 75;

        const mouth = new PIXI.Graphics();
        mouth.lineStyle(3, 0xFF6B8A);
        mouth.arc(0, 0, 8, 0, Math.PI);
        mouth.x = 100;
        mouth.y = 90;

        const hair = new PIXI.Graphics();
        hair.beginFill(0x8B4513);
        hair.drawEllipse(0, 0, 45, 35);
        hair.endFill();
        hair.x = 100;
        hair.y = 55;

        const body = new PIXI.Graphics();
        body.beginFill(0x4A90E2);
        body.drawRoundedRect(0, 0, 60, 80, 10);
        body.endFill();
        body.x = 70;
        body.y = 120;

        this.character.addChild(hair);
        this.character.addChild(head);
        this.character.addChild(leftEye);
        this.character.addChild(rightEye);
        this.character.addChild(mouth);
        this.character.addChild(body);

        this.character.y = -40;

        this.parts = { head, leftEye, rightEye, mouth, body };
        this.app.stage.addChild(this.character);
    }

    setupInteractions() {
        this.character.interactive = true;
        this.character.buttonMode = true;

        this.character.on('pointerdown', () => {
            this.showRandomComment();
            this.playSimpleAnimation();
        });

        this.character.on('pointerover', () => {
            this.character.scale.set(1.0);
        });

        this.character.on('pointerout', () => {
            this.character.scale.set(1.0);
        });
    }

    playSimpleAnimation() {
        const originalY = this.character.y;
        this.character.y = originalY - 10;
        setTimeout(() => {
            this.character.y = originalY;
        }, 200);
    }

    showRandomComment() {
        const message = this.comments[Math.floor(Math.random() * this.comments.length)];

        if (this.commentElement) {
            this.commentElement.textContent = message;
            this.commentElement.classList.add('show');

            setTimeout(() => {
                this.commentElement.classList.remove('show');
            }, 3000);
        }
    }

    startIdleAnimation() {
        const breathe = () => {
            if (!this.isInitialized || !this.parts) return;

            const time = Date.now() * 0.002;
            const breathScale = 1 + Math.sin(time) * 0.02;

            if (this.parts.body) {
                this.parts.body.scale.y = breathScale;
            }

            if (Math.random() < 0.005) {
                this.blinkEyes();
            }

            requestAnimationFrame(breathe);
        };

        requestAnimationFrame(breathe);
    }

    blinkEyes() {
        const { leftEye, rightEye } = this.parts;
        [leftEye, rightEye].forEach(eye => {
            eye.scale.y = 0.1;
            setTimeout(() => {
                eye.scale.y = 1;
            }, 150);
        });
    }

    handleResize() {
        if (!this.app) return;

        const container = document.getElementById('live2d-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            this.app.renderer.resize(rect.width, rect.height);
        }
    }
}
