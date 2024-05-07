<script setup>
import { ref, computed, inject } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import BtnDBTable from '@/components/buttons/BtnDBTable.vue';

import { useRequest } from '@/stores/api/requests';
import { useIPAddress } from '@/stores/api/ipaddresses';
import { useOrganization } from '@/stores/api/organizations';
import { useSubdivision } from '@/stores/api/subdivisions';
import { useDepartment } from '@/stores/api/departments';
import { useLocation } from '@/stores/api/locations';
import { usePosition } from '@/stores/api/positions';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const $helpdesk = inject('helpdesk');

const { findOne, createOne, updateOne, removeOne } = useRequest();

const IPAddress = useIPAddress();
const Organization = useOrganization();
const Subdivision = useSubdivision();
const Department = useDepartment();
const Position = usePosition();
const Location = useLocation();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      fullname: yup.string().required(t('Value is required')),
      phone: yup.string().required(t('Value is required')),
      request: yup.string().required(t('Value is required'))
    }),
    initialValues: {}
  });

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        const response = await findOne({ id, populate: false });
        setValues(response);
        if (response.organization) {
          subdivisions.value = await Subdivision.findAllByOrganizationId({
            id: response.organization
          });
        }
      }
      const [organization, department, position, location] = await Promise.allSettled([
        Organization.findAll({}),
        Department.findAll({}),
        Position.findAll({}),
        Location.findAllGroured({})
      ]);
      organizations.value = organization.value;
      departments.value = department.value;
      positions.value = position.value;
      locations.value = location.value;

      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const isClosed = computed(() => {
  return values?.workerClose ? true : false;
});

const refMenu = ref();
const options = ref([
  {
    label: t('Create record'),
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
  {
    label: t('Save record'),
    icon: 'pi pi-save',
    disabled: isClosed,
    command: async () => await onSaveRecord()
  },
  {
    label: t('Delete record'),
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const organizations = ref([]);
const subdivisions = ref([]);
const departments = ref([]);
const positions = ref([]);
const locations = ref([]);

const [ipaddress, ipaddressAttrs] = defineField('ipaddress');
const [fullname, fullnameAttrs] = defineField('fullname');
const [phone, phoneAttrs] = defineField('phone');
const [position, positionAttrs] = defineField('position');
const [location, locationAttrs] = defineField('location');
const [organization, organizationAttrs] = defineField('organization');
const [subdivision, subdivisionAttrs] = defineField('subdivision');
const [department, departmentAttrs] = defineField('department');
const [request, requestAttrs] = defineField('request');
const [reqnum, reqnumAttrs] = defineField('reqnum');
const [conclusion, conclusionAttrs] = defineField('conclusion');
const [comment, commentAttrs] = defineField('comment');

const onSubdivisionsUpdate = async event => {
  if (event?.value) {
    subdivisions.value = await Subdivision.findAllByOrganizationId({ id: event.value });
  } else {
    setValues({
      organization: null,
      subdivision: null
    });
    subdivisions.value = [];
  }
};

const findOneIPAddress = async () => {
  try {
    if (values?.ipaddress) {
      const record = await IPAddress.findOneByIP({ ipaddress: values.ipaddress });
      if (record?.ipaddress) {
        setValues({
          ipaddress: record?.ipaddress || null,
          location: record?.location || null,
          fullname: record?.fullname || null,
          phone: record?.phone || null,
          position: record?.position || null,
          organization: record?.organization || null,
          subdivision: record?.subdivision || null,
          department: record?.department || null
        });
      } else {
        toast.add({
          severity: 'warn',
          summary: t('Warning'),
          detail: t('IP Address not found'),
          life: 3000
        });
      }
    } else {
      toast.add({
        severity: 'warn',
        summary: t('Warning'),
        detail: t('IP Address not entered'),
        life: 3000
      });
    }
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t(err.message),
      life: 3000
    });
  }
};

const onCreateRecord = async () => {
  resetForm({ values: {} }, { force: true });
  toast.add({
    severity: 'success',
    summary: t('Information'),
    detail: t('Input new record'),
    life: 5000
  });
};

const onRemoveRecord = async () => {
  if (!values?.id) {
    return toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t('Record not selected'),
      life: 5000
    });
  }
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('Confirm delete record'),
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne(values);
        toast.add({
          severity: 'success',
          summary: t('Information'),
          detail: t('Record is removed'),
          life: 5000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: t('Warning'),
          detail: t('Record not removed'),
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('Information'),
        detail: t('Record deletion not confirmed'),
        life: 5000
      });
    }
  });
};

const onSaveClosedRecord = handleSubmit(async () => {
  setValues({
    workerClose: $helpdesk?.user?.id || undefined
  });

  await onSaveRecord();
});

const onSaveRecord = handleSubmit(async () => {
  if (values?.id) {
    try {
      await updateOne(values.id, { ...controlledValues.value, workerClose: values.workerClose });
      visible.value = false;
      toast.add({
        severity: 'success',
        summary: t('Information'),
        detail: t('Record is updated'),
        life: 3000
      });
    } catch (err) {
      toast.add({
        severity: 'warn',
        summary: t('Warning'),
        detail: t('Record not updated'),
        life: 3000
      });
    }
  } else {
    try {
      await createOne({
        ...controlledValues.value,
        workerOpen: $helpdesk?.user?.id || undefined,
        workerClose: values.workerClose || undefined
      });
      visible.value = false;
      toast.add({
        severity: 'success',
        summary: t('Information'),
        detail: t('Record is created'),
        life: 3000
      });
    } catch (err) {
      toast.add({
        severity: 'warn',
        summary: t('Warning'),
        detail: t('Record not created'),
        life: 3000
      });
    }
  }
});

const onCloseModal = async () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};
</script>

<template>
  <Menu ref="refMenu" popup :model="options">
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>

  <Dialog
    modal
    closable
    :draggable="false"
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] 2xl:w-[45vw]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <AppIcons name="technical-support" :size="40" class="mr-4" />
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('Technical support') }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500" v-show="!isClosed">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500">
              {{ $t('Status') }} :
              {{ isClosed ? $t('Request closed') : $t('Request opened') }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <Button
            text
            plain
            rounded
            class="h-12 w-12"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form class="flex flex-col gap-y-4 md:flex-row md:flex-wrap" @submit.prevent="onSaveRecord">
      <div class="flex flex-col space-y-4 md:!w-1/2 md:pr-2">
        <div class="flex flex-col gap-2">
          <label for="request" class="font-bold">{{ $t('Client request') }}</label>
          <Textarea
            rows="8"
            id="request"
            v-model="request"
            v-bind="requestAttrs"
            :placeholder="$t('Client request')"
            :invalid="!!errors?.request"
            aria-describedby="request-help"
          />
          <small id="request-help" class="text-red-500" v-if="errors?.request">
            {{ $t(errors.request) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="reqnum" class="font-bold">{{ $t('Letter number') }}</label>
          <InputText
            id="reqnum"
            v-model="reqnum"
            v-bind="reqnumAttrs"
            :placeholder="$t('Letter number')"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="ipaddress" class="font-bold">{{ $t('IP Address') }}</label>

          <div class="flex flex-row gap-2">
            <InputText
              id="ipaddress"
              v-model="ipaddress"
              v-bind="ipaddressAttrs"
              :placeholder="$t('Client IP Address')"
              :invalid="!!errors?.ipaddress"
              class="w-full pr-10"
              @keypress.enter="findOneIPAddress"
              aria-describedby="ipaddress-help"
            />

            <Button
              outlined
              icon="pi pi-search"
              :class="[
                'flex-none',
                'w-12 h-12',
                'text-surface-500 dark:text-surface-300',
                'border-surface-300 dark:border-surface-600',
                'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
              ]"
              v-tooltip.bottom="$t('Find IP Address')"
              @click.prevent="findOneIPAddress"
            />
          </div>

          <small id="ipaddress-help" class="text-red-500" v-if="errors?.ipaddress">
            {{ $t(errors.ipaddress) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="conclusion" class="font-bold">{{ $t('Conclusion for request') }}</label>
          <Textarea
            rows="5"
            aria-describedby="conclusion-help"
            id="conclusion"
            v-model="conclusion"
            v-bind="conclusionAttrs"
            :placeholder="$t('Conclusion')"
          />
        </div>
      </div>

      <div class="flex flex-col space-y-4 md:!w-1/2 md:pl-2">
        <div class="flex flex-col gap-2">
          <label for="client-info" class="font-bold">{{ $t('Client info') }}</label>
          <div class="flex flex-col gap-2" id="client-info">
            <div class="flex flex-col gap-2">
              <InputText
                id="fullname"
                v-model="fullname"
                v-bind="fullnameAttrs"
                :placeholder="$t('Client fullname')"
                :invalid="!!errors?.fullname"
                aria-describedby="fullname-help"
              />
              <small id="fullname-help" class="text-red-500" v-if="errors?.fullname">
                {{ $t(errors.fullname) }}
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <InputText
                id="phone"
                v-model="phone"
                v-bind="phoneAttrs"
                :placeholder="$t('Client phone')"
                :invalid="!!errors?.phone"
                aria-describedby="phone-help"
              />
              <small id="phone-help" class="text-red-500" v-if="errors?.phone">
                {{ $t(errors.phone) }}
              </small>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="location" class="font-bold">{{ $t('Location') }}</label>
          <div class="flex flex-row gap-2">
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              optionGroupLabel="group"
              optionGroupChildren="records"
              inputId="location"
              v-model="location"
              v-bind="locationAttrs"
              :options="locations"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client location')"
              :invalid="!!errors?.location"
              aria-describedby="location-help"
              :virtualScrollerOptions="{ itemSize: 32 }"
              :ptOptions="{ mergeSections: true, mergeProps: true }"
              :pt="{
                root: { class: ['w-full'] },
                input: { class: ['!whitespace-normal'] },
                itemgroup: {
                  class: [
                    'font-bold m-0 py-3 px-5 cursor-auto',
                    'text-surface-800 dark:text-white/80',
                    'bg-surface-200 dark:bg-surface-900/80'
                  ]
                }
              }"
            >
              <template #optiongroup="{ option }">
                <div class="flex items-center h-full justify-center text-base uppercase">
                  {{ option.group }}
                </div>
              </template>
              <template #option="{ option }">
                <div class="flex items-center h-full text-base">
                  {{ option.name }}
                </div>
              </template>
            </Dropdown>

            <BtnDBTable table="location" />
          </div>

          <small id="location-help" class="text-red-500" v-if="errors?.location">
            {{ $t(errors.location) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="position" class="font-bold">{{ $t('Position') }}</label>
          <div class="flex flex-row gap-2">
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              inputId="position"
              v-model="position"
              v-bind="positionAttrs"
              :options="positions"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client position')"
              v-tooltip.bottom="$t('Client position')"
              :invalid="!!errors?.position"
              aria-describedby="position-help"
              :ptOptions="{ mergeSections: true, mergeProps: true }"
              :pt="{
                root: { class: ['w-full'] },
                input: { class: ['!whitespace-normal'] }
              }"
            />

            <BtnDBTable table="position" />
          </div>

          <small id="position-help" class="text-red-500" v-if="errors?.position">
            {{ $t(errors.position) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="organizations" class="font-bold">{{ $t('Organization') }}</label>
          <div class="flex flex-col gap-2" id="organizations">
            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-2">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  inputId="organization"
                  v-model="organization"
                  v-bind="organizationAttrs"
                  :options="organizations"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client organization')"
                  v-tooltip.bottom="$t('Client organization')"
                  :invalid="!!errors?.organization"
                  aria-describedby="organization-help"
                  :ptOptions="{ mergeSections: true, mergeProps: true }"
                  :pt="{
                    root: { class: ['w-full'] },
                    input: { class: ['!whitespace-normal'] }
                  }"
                  @change="onSubdivisionsUpdate"
                />

                <BtnDBTable table="organization" />
              </div>

              <small id="organization-help" class="text-red-500" v-if="errors?.organization">
                {{ $t(errors.organization) }}
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-2">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  inputId="subdivision"
                  v-model="subdivision"
                  v-bind="subdivisionAttrs"
                  :options="subdivisions"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client subdivision')"
                  v-tooltip.bottom="$t('Client subdivision')"
                  :invalid="!!errors?.subdivision"
                  aria-describedby="subdivision-help"
                  :ptOptions="{ mergeSections: true, mergeProps: true }"
                  :pt="{
                    root: { class: ['w-full'] },
                    input: { class: ['!whitespace-normal'] }
                  }"
                />

                <BtnDBTable table="subdivision" />
              </div>

              <small id="subdivision-help" class="text-red-500" v-if="errors?.subdivision">
                {{ $t(errors.subdivision) }}
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex flex-row w-full gap-2">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  inputId="department"
                  v-model="department"
                  v-bind="departmentAttrs"
                  :options="departments"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client department')"
                  v-tooltip.bottom="$t('Client department')"
                  :invalid="!!errors?.department"
                  aria-describedby="department-help"
                  :ptOptions="{ mergeSections: true, mergeProps: true }"
                  :pt="{
                    root: { class: ['w-full'] },
                    input: { class: ['!whitespace-normal'] }
                  }"
                />

                <BtnDBTable table="department" />
              </div>

              <small id="department-help" class="text-red-500" v-if="errors?.department">
                {{ $t(errors.department) }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div class="flex flex-col gap-2">
          <label for="comment" class="font-bold">{{ $t('Comment') }}</label>
          <Textarea
            rows="6"
            id="comment"
            v-model="comment"
            v-bind="commentAttrs"
            :placeholder="$t('Comment')"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <Button
        text
        plain
        icon="pi pi-times"
        :label="$t('Cancel')"
        :disabled="isClosed"
        v-show="!isClosed"
        @click="visible = false"
      />

      <Button
        text
        plain
        icon="pi pi-check"
        :label="$t('Save')"
        :disabled="isClosed"
        v-show="!isClosed"
        @click="onSaveRecord"
      />

      <Button
        text
        plain
        icon="pi pi-check-circle"
        :label="$t('Save and closed')"
        :disabled="isClosed"
        v-show="!isClosed"
        @click="onSaveClosedRecord"
      />
    </template>
  </Dialog>
</template>
