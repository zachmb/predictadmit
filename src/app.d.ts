import type { Session } from '@auth/core/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}

	// Favente recruit pixel (favente.so) — loaded site-wide in app.html.
	interface Window {
		Favente?: {
			track?: (payload: { email: string; event: string; [k: string]: unknown }) => void;
			recruit?: (...args: unknown[]) => void;
			q?: unknown[];
			[k: string]: unknown;
		};
	}
}

export {};
