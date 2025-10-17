import { GridsStateType } from './gridsContext';

class DemoManager {
    private static instance: DemoManager;
    private demoData: GridsStateType | null = null;
    private isLoading: boolean = false;

    private constructor() {}

    static getInstance(): DemoManager {
        if (!DemoManager.instance) {
            DemoManager.instance = new DemoManager();
        }
        return DemoManager.instance;
    }

    async loadDemo(): Promise<void> {
        if (this.isLoading || this.demoData) return;
        
        this.isLoading = true;
        try {
            const response = await fetch('/demo.json');
            this.demoData = await response.json();
        } catch (err) {
            console.error("Failed to load demo:", err);
        } finally {
            this.isLoading = false;
        }
    }

    getDemoData(): GridsStateType | null {
        return this.demoData;
    }
}

export const demoManager = DemoManager.getInstance();