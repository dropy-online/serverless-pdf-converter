import GM, { State } from 'gm';
import { Options, ConvertErrors } from '@/types';
import { createError } from '@/utils';

const gm = GM.subClass({ imageMagick: true });

export class Converter {
  private state: State;

  private pages: { [key: number]: State | null };

  private options: Options;

  constructor(buffer: Buffer, options: Options) {
    this.state = gm(buffer);
    this.pages = {};
    this.options = options;

    this.limitMemory();
  }

  limitMemory(): void {
    this.state = this.state.limit('memory', process.env.CONVERT_MEMORY_SIZE);
  }

  selectPage(page: number): void {
    this.pages[page] = this.state.selectFrame(page);
  }

  optimize(page: number): void {
    const { size, quality, density } = this.options;
    const current = this.pages[page];
    if (size) current.resize(size);
    if (quality) current.quality(quality);
    if (density) current.density(density, density);
  }

  convert(page: number): Promise<Buffer> {
    const { format } = this.options;

    this.selectPage(page);
    this.optimize(page);

    return new Promise((resolve, reject) => {
      this.pages[page]
        .noProfile()
        .toBuffer(format, (error, buffer) =>
          error
            ? reject(
                createError({ code: ConvertErrors.FAILED_CONVERT_PAGE, message: error.message })
              )
            : resolve(buffer)
        );
    });
  }
}
