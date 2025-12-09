<script lang="ts">
  import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
  import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
</script>

<svelte:head>
  <title>About PredictAdmit.com </title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif flex flex-col">
  <SiteHeader />

    <div class="flex-grow max-w-5xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-4">About PredictAdmit.com</h1>
        <p class="mb-4">
        PredictAdmit.com is a college admissions prediction platform designed to help prospective students understand their chances of admission to various universities. By leveraging historical admissions data and advanced machine learning algorithms, we provide personalized predictions based on individual applicant profiles.
        </p>
        <h2 class="text-2xl font-semibold mb-3">Our Mission</h2>
        <p class="mb-4">
        Our mission is to empower students with data-driven insights to make informed decisions about their college applications. We aim to demystify the admissions process and provide transparency in an often opaque system.
        </p>
        <h2 class="text-2xl font-semibold mb-3">How It Works</h2>
        <p class="mb-4">
        Users create a profile by entering their academic achievements, extracurricular activities, and other relevant information. Our algorithms analyze this data against historical admissions trends to generate a probability score for acceptance at various institutions.
        </p>
        <h2 class="text-2xl font-semibold mb-3">Contact Us</h2>
        <p>
        If you have any questions or feedback, please feel free to reach out to us at <a href="mailto:crew@looplessapp.com" class="text-blue-600 underline">crew@looplessapp.com</a>
  </div>

  <SiteFooter />
</main>