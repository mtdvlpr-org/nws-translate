<template>
  <UPage>
    <UPageHeader
      :title="title"
      headline="Vertalen"
      :description="description"
    />

    <UPageBody>
      <UButton
        loading-auto
        color="neutral"
        label="Liederen automatisch vertalen"
        @click="translateSongs"
      />
      <template v-if="loading">
        <UPageGrid>
          <div v-for="i in 12" :key="i" class="grid gap-2">
            <USkeleton class="h-4 w-3xs" />
            <USkeleton class="h-4 w-20" />
            <USkeleton class="h-4 w-full" />
          </div>
        </UPageGrid>
      </template>
      <template v-else>
        <UPageGrid>
          <SongForm
            v-for="song in translationStore.originals.songs"
            :key="song.number"
            :song="song"
          />
        </UPageGrid>
      </template>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const translationStore = useTranslationStore();

const loading = ref(false);
const { showError, showSuccess } = useFlash();

const translateSongs = async () => {
  loading.value = true;
  try {
    const res = await $fetch<{
      files: { O: { MP3: { title: string; track: number }[] } };
    }>(
      "https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?pub=sjjm&langwritten=O&fileformat=MP3",
    );

    const songs = res.files.O.MP3.filter((s) => s.track <= 500).map(
      (song): Song => ({
        number: song.track.toString(),
        title: song.title.replace(/^\d+\. /, ""),
      }),
    );

    translationStore.setTranslations({ songs }, "songs");
    showSuccess({
      description: "Liederen zijn geüpdatet.",
      id: "songs-updated",
    });
  } catch {
    showError({
      description: "Kon liederen niet ophalen. Probeer het later opnieuw.",
      id: "songs-error",
    });
  }
  loading.value = false;
};

const title = "Liederen";
const description = "Vertaal op deze pagina de liederen.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
