import "./style.css"
import vertex from "./vertex.wgsl?raw"
import fragment from "./fragment.wgsl?raw"

class Main {
	private canvas: HTMLCanvasElement = document.createElement("canvas")
	private context: GPUCanvasContext
	private adapter?: GPUAdapter
	private device?: GPUDevice
	private pipeline?: GPURenderPipeline
	constructor() {
		document.querySelector('#app')!.appendChild(this.canvas)
		this.context = this.canvas.getContext("webgpu")!
		this.init()
	}

	private async init() {
		this.adapter = await this.getAdapter()
		this.device = await this.getGPUDevice()
		this.context.configure({
			device: this.device,
			format: navigator.gpu.getPreferredCanvasFormat(),
			alphaMode: "opaque",
		})
		this.pipeline = this.device.createRenderPipeline({
			layout: "auto",
			vertex: {
				module: this.device.createShaderModule({
					code: vertex,
				}),
				entryPoint: "main",
			},
			fragment: {
				module: this.device.createShaderModule({
					code: fragment,
				}),
				entryPoint: "main",
				targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
			},
			primitive: {
				topology: "triangle-list",
			},
    })
    this.render()
	}

	private render() {
		let commandEncoder = this.device!.createCommandEncoder()
		let renderPassEncoder = commandEncoder.beginRenderPass({
			colorAttachments: [
				{
					view: this.context.getCurrentTexture().createView(),
					clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
					loadOp: "clear",
					storeOp: "store",
				},
			],
		})
		renderPassEncoder.setPipeline(this.pipeline!)
		renderPassEncoder.draw(3, 1, 0, 0)
		renderPassEncoder.end()
    this.device?.queue.submit([commandEncoder.finish()])
    requestAnimationFrame(this.render.bind(this))
	}

	private async getAdapter() {
		const adapter = await navigator.gpu.requestAdapter()
		if (!adapter) {
			throw new Error("No GPU Adapter found")
		}
		return adapter
	}

	private async getGPUDevice() {
		if (!this.adapter) {
			throw new Error("No GPU Adapter found")
		}
		const device = await this.adapter.requestDevice()
		if (!device) {
			throw new Error("No GPU Device found")
		}
		return device
	}
}
new Main()
