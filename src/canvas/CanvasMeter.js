import Entity from 'core/Entity';
import { setColor } from 'utils/canvas';

export default class CanvasMeter extends Entity {
  static config = {
    name: 'CanvasMeter',
    description: 'Canvas meter.',
    type: 'entity',
    defaultProperties: {
      width: 100,
      height: 50,
      color: '#FFFFFF',
      origin: 'left',
    },
  };

  constructor(properties, canvas) {
    const {
      config: { name, defaultProperties },
    } = CanvasMeter;

    super(name, { ...defaultProperties, ...properties });

    this.canvas = canvas || document.createElement('canvas');
    this.canvas.width = this.properties.width;
    this.canvas.height = this.properties.height;

    this.context = this.canvas.getContext('2d');
  }

  render(value) {
    const { canvas, context } = this;

    const { height, width, color, origin } = this.properties;

    // Reset canvas
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    } else {
      context.clearRect(0, 0, width, height);
    }

    // Canvas setup
    setColor(context, color, 0, 0, 0, height);

    switch (origin) {
      case 'left':
        context.fillRect(0, 0, value * width, height);
        break;
      case 'bottom':
        context.fillRect(0, height, width, -value * height);
        break;
      case 'right':
        context.fillRect(width, 0, -value * width, height);
        break;
      case 'top':
        context.fillRect(0, 0, width, -value * height);
        break;
    }
  }
}
