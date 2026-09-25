<footer class="site-footer">
	<div class="container">
		<div class="footer-grid">
			<!-- Brand Column -->
			<div class="footer-brand">
				<a href="/" class="footer-logo">predictadmit<span>.com</span></a>
				<p class="footer-blurb">
					A practice run for admissions decisions. Everything's labeled as a simulation, and every
					result shows the reasoning behind it.
				</p>
				<div class="footer-copy">&copy; 2026 PredictAdmit.</div>
			</div>

			<!-- Links Column 1 -->
			<div>
				<h4 class="footer-head">Platform</h4>
				<ul class="footer-links">
					<li><a href="/portals">All Portals</a></li>
					<li><a href="/ai">AI Analysis</a></li>
					<li><a href="/pricing">Pricing</a></li>
				</ul>
			</div>

			<!-- Links Column 2 -->
			<div>
				<h4 class="footer-head">Resources</h4>
				<ul class="footer-links">
					<li><a href="/chances">Chances Calculator</a></li>
					<li><a href="/junior-diagnostic">Junior Diagnostic</a></li>
					<li><a href="/research-hub">Research Hub</a></li>
					<li><a href="/methodology">Methodology</a></li>
					<li><a href="/summer-programs">Summer Programs</a></li>
				</ul>
			</div>

			<!-- Links Column 3 -->
			<div>
				<h4 class="footer-head">Company</h4>
				<ul class="footer-links">
					<li><a href="/about">About Us</a></li>
					<li><a href="/terms">Terms of Service</a></li>
					<li><a href="/privacy">Privacy Policy</a></li>
					<li><a href="/contact">Contact Support</a></li>
				</ul>
			</div>
		</div>

		<div class="footer-fine">
			<p>Not affiliated with any university. For entertainment and educational purposes only.</p>
			<p>
				Prediction weights are based on NACAC's
				<a href="/methodology">Factors in the Admission Decision</a>
				survey and 2026-cycle HYPSM &amp; Top-20 admit data. NACAC does not endorse PredictAdmit.
			</p>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		margin-top: 6rem;
	}
	.footer-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		margin-bottom: 2.75rem;
	}
	@media (min-width: 768px) {
		.footer-grid {
			grid-template-columns: 1.5fr 1fr 1fr 1fr;
		}
	}
	.footer-brand {
		grid-column: 1 / -1;
	}
	@media (min-width: 768px) {
		.footer-brand {
			grid-column: auto;
		}
	}
	.footer-logo {
		display: inline-block;
		font-family: var(--font-display);
		font-size: 1.2rem;
		color: #fff;
		text-decoration: none;
		margin-bottom: 0.9rem;
	}
	.footer-logo span {
		color: var(--cyan);
	}
	.footer-blurb {
		font-size: 0.92rem;
		line-height: 1.6;
		color: #cfe0f5;
		max-width: 22rem;
		margin: 0 0 1.2rem;
	}
	.footer-copy {
		font-size: 0.8rem;
		color: #93a9cf;
	}
	.footer-head {
		font-family: var(--font-display);
		font-size: 0.9rem;
		color: #fff;
		margin: 0 0 1rem;
	}
	.footer-links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}
	.footer-links a {
		font-size: 0.92rem;
		color: #cfe0f5;
		text-decoration: none;
	}
	.footer-links a:hover {
		color: var(--cyan);
	}
	.footer-fine {
		padding-top: 1.8rem;
		border-top: 3px dashed rgba(53, 205, 238, 0.4);
		text-align: center;
		font-size: 0.8rem;
		color: #93a9cf;
	}
	.footer-fine p {
		margin: 0 0 0.6rem;
		line-height: 1.6;
	}
	.footer-fine a {
		color: #cfe0f5;
		text-decoration: underline;
	}
	.footer-fine a:hover {
		color: var(--cyan);
	}
</style>
