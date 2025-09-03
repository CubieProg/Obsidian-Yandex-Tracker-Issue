import { MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import YTIPlugin from "../../main.tsx";

export class YTIMarkdownRenderer extends MarkdownRenderChild {
    private source: string;
    private context: MarkdownPostProcessorContext;

    private plugin: YTIPlugin;
    private renderGroup: string | null = null;

    private renderCallback: Function


    constructor(
        plugin: YTIPlugin,
        renderGroup: string | null = null,

        source: string,
        containerEl: HTMLElement,
        ctx: MarkdownPostProcessorContext,

        renderCallback: Function,
    ) {
        super(containerEl);
        this.plugin = plugin;
        this.renderGroup = renderGroup;

        this.source = source;
        this.context = ctx;

        this.renderCallback = renderCallback;
        this.display();
    }

    onload() {
        this.registerEvent(
            this.plugin.app.vault.on(
                "yandex-tracker-issue:rerender",
                this.display.bind(this)
            )
        );

        if(this.renderGroup !== null) {
            this.registerEvent(
                this.plugin.app.vault.on(
                    `yandex-tracker-issue:rerender-${this.renderGroup}`,
                    this.display.bind(this)
                )
            );  
        }
    }

    display() {
        this.containerEl.empty();

        try {
            this.renderCallback(
                this.source,
                this.containerEl,
                this.context
            );
        } catch (err) {
            console.error(`Renderer error ${err}`);
        }
    }
}
