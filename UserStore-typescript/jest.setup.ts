// jest.setup.ts
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;

global.TextDecoder = TextDecoder;
