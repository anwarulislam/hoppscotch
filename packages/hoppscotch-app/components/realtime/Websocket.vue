<template>
  <AppPaneLayout>
    <template #primary>
      <div
        class="sticky top-0 z-10 flex flex-shrink-0 p-4 overflow-x-auto space-x-2 bg-primary hide-scrollbar"
      >
        <div class="inline-flex flex-1 space-x-2">
          <input
            id="websocket-url"
            v-model="url"
            class="w-full px-4 py-2 border rounded bg-primaryLight border-divider text-secondaryDark"
            type="url"
            autocomplete="off"
            spellcheck="false"
            :class="{ error: !urlValid }"
            :placeholder="`${t('websocket.url')}`"
            :disabled="connectionState"
            @keyup.enter="urlValid ? toggleConnection() : null"
          />
          <ButtonPrimary
            id="connect"
            :disabled="!urlValid"
            class="w-32"
            name="connect"
            :label="
              !connectionState ? t('action.connect') : t('action.disconnect')
            "
            :loading="connectingState"
            @click.native="toggleConnection"
          />
        </div>
      </div>
      <SmartTabs
        v-model="selectedTab"
        styles="sticky bg-primary top-upperMobilePrimaryStickyFold sm:top-upperPrimaryStickyFold z-10"
      >
        <SmartTab
          :id="'communication'"
          :label="`${$t('websocket.communication')}`"
        >
          <RealtimeCommunication
            @send-message="sendMessage($event)"
          ></RealtimeCommunication>
        </SmartTab>
        <SmartTab :id="'protocols'" :label="`${$t('websocket.protocols')}`">
          <div
            class="sticky z-10 flex items-center justify-between pl-4 border-b bg-primary border-dividerLight top-upperPrimaryStickyFold"
          >
            <label class="font-semibold text-secondaryLight">
              {{ t("websocket.protocols") }}
            </label>
            <div class="flex">
              <ButtonSecondary
                v-tippy="{ theme: 'tooltip' }"
                :title="t('action.clear_all')"
                svg="trash-2"
                @click.native="clearContent"
              />
              <ButtonSecondary
                v-tippy="{ theme: 'tooltip' }"
                :title="t('add.new')"
                svg="plus"
                @click.native="addProtocol"
              />
            </div>
          </div>
          <draggable
            v-model="protocols"
            animation="250"
            handle=".draggable-handle"
            draggable=".draggable-content"
            ghost-class="cursor-move"
            chosen-class="bg-primaryLight"
            drag-class="cursor-grabbing"
          >
            <div
              v-for="(protocol, index) of protocols"
              :key="`protocol-${index}`"
              class="flex border-b divide-x divide-dividerLight border-dividerLight draggable-content group"
            >
              <span>
                <ButtonSecondary
                  svg="grip-vertical"
                  class="cursor-auto text-primary hover:text-primary"
                  :class="{
                    'draggable-handle group-hover:text-secondaryLight !cursor-grab':
                      index !== protocols?.length - 1,
                  }"
                  tabindex="-1"
                />
              </span>
              <input
                v-model="protocol.value"
                class="flex flex-1 px-4 py-2 bg-transparent"
                :placeholder="`${t('count.protocol', { count: index + 1 })}`"
                name="message"
                type="text"
                autocomplete="off"
                @change="
                  updateProtocol(index, {
                    value: $event.target.value,
                    active: protocol.active,
                  })
                "
              />
              <span>
                <ButtonSecondary
                  v-tippy="{ theme: 'tooltip' }"
                  :title="
                    protocol.hasOwnProperty('active')
                      ? protocol.active
                        ? t('action.turn_off')
                        : t('action.turn_on')
                      : t('action.turn_off')
                  "
                  :svg="
                    protocol.hasOwnProperty('active')
                      ? protocol.active
                        ? 'check-circle'
                        : 'circle'
                      : 'check-circle'
                  "
                  color="green"
                  @click.native="
                    updateProtocol(index, {
                      value: protocol.value,
                      active: !protocol.active,
                    })
                  "
                />
              </span>
              <span>
                <ButtonSecondary
                  v-tippy="{ theme: 'tooltip' }"
                  :title="t('action.remove')"
                  svg="trash"
                  color="red"
                  @click.native="deleteProtocol(index)"
                />
              </span>
            </div>
          </draggable>
          <div
            v-if="protocols.length === 0"
            class="flex flex-col items-center justify-center p-4 text-secondaryLight"
          >
            <img
              :src="`/images/states/${$colorMode.value}/add_category.svg`"
              loading="lazy"
              class="inline-flex flex-col object-contain object-center w-16 h-16 my-4"
              :alt="`${t('empty.protocols')}`"
            />
            <span class="mb-4 text-center">
              {{ t("empty.protocols") }}
            </span>
          </div>
        </SmartTab>
      </SmartTabs>
    </template>
    <template #secondary>
      <RealtimeLog :title="t('websocket.log')" :log="log" />
    </template>
  </AppPaneLayout>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "@nuxtjs/composition-api"
import draggable from "vuedraggable"
import WSSessionAdapter from "~/helpers/realtime/WSSessionAdapter"
import {
  useI18n,
  useNuxt,
  useReadonlyStream,
  useStream,
  useToast,
} from "~/helpers/utils/composables"
import {
  deleteAllWSProtocols,
  setWSEndpoint,
  setWSProtocols,
  WSEndpoint$,
  WSLog$,
  WSProtocols$,
} from "~/newstore/WebSocketSession"

const nuxt = useNuxt()
const t = useI18n()
const toast = useToast()
const adapter = new WSSessionAdapter(nuxt.value, toast, t)

const selectedTab = ref("communication")
const url = useStream(WSEndpoint$, "", setWSEndpoint)
const protocols = useStream(WSProtocols$, [], setWSProtocols)
const connectionState = useReadonlyStream(adapter.connection$, false)
const connectingState = useReadonlyStream(adapter.connecting$, false)
const log = useReadonlyStream(WSLog$, [])

// DATA
const isUrlValid = ref(true)

const urlValid = computed(() => isUrlValid)

watch(url, (newUrl) => {
  if (newUrl) adapter.debouncer(url.value)
})

onUnmounted(() => {
  adapter.terminate()
})

const clearContent = () => {
  deleteAllWSProtocols()
}

const toggleConnection = () => {
  // If it is connecting:
  if (!connectionState.value) return adapter.connect(url.value)
  // Otherwise, it's disconnecting.
  else return adapter.disconnect()
}

const sendMessage = (event: { message: string; eventName: string }) => {
  adapter.sendMessage(event)
}

const addProtocol = () => {
  adapter.addProtocol()
}

const deleteProtocol = (index: number) => {
  adapter.deleteProtocol(index)
}

const updateProtocol = (index: number, updated: any) => {
  adapter.updateProtocol(index, updated)
}
</script>
