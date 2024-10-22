<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import BtnDBTable from '@/components/buttons/BtnDBTable.vue';

import { dateToStr } from '@/service/DataFilters';
import { useMailbox } from '@/stores/api/mailboxes';
import { useOrganization } from '@/stores/api/organizations';
import { useSubdivision } from '@/stores/api/subdivisions';
import { useDepartment } from '@/stores/api/departments';
import { useLocation } from '@/stores/api/locations';
import { usePosition } from '@/stores/api/positions';

const toast = useToast();
const confirm = useConfirm();

const { findOne, createOne, updateOne, removeOne } = useMailbox();

const Location = useLocation();
const Organization = useOrganization();
const Subdivision = useSubdivision();
const Department = useDepartment();
const Position = usePosition();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      reqnum: yup.string().required('Потрібно вказати значення'),
      login: yup.string().required('Потрібно вказати значення'),
      fullname: yup.string().required('Потрібно вказати значення'),
      phone: yup.string().required('Потрібно вказати значення'),
      dateOpen: yup.string().required('Потрібно вказати значення')
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
      const [location, organization, department, position] = await Promise.allSettled([
        Location.findAllGroured({}),
        Organization.findAll({}),
        Department.findAll({}),
        Position.findAll({})
      ]);
      locations.value = location.value;
      organizations.value = organization.value;
      departments.value = department.value;
      positions.value = position.value;

      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const refMenu = ref();
const options = ref([
  {
    label: 'Створити запис',
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
  {
    label: 'Зберегти запис',
    icon: 'pi pi-save',
    command: async () => await onSaveRecord()
  },
  {
    label: 'Видалити запис',
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const locations = ref([]);
const organizations = ref([]);
const subdivisions = ref([]);
const departments = ref([]);
const positions = ref([]);

const [reqnum, reqnumAttrs] = defineField('reqnum');
const [login, loginAttrs] = defineField('login');
const [fullname, fullnameAttrs] = defineField('fullname');
const [phone, phoneAttrs] = defineField('phone');
const [dateOpen, dateOpenAttrs] = defineField('dateOpen');
const [dateClose, dateCloseAttrs] = defineField('dateClose');
const [location, locationAttrs] = defineField('location');
const [organization, organizationAttrs] = defineField('organization');
const [subdivision, subdivisionAttrs] = defineField('subdivision');
const [department, departmentAttrs] = defineField('department');
const [position, positionAttrs] = defineField('position');
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

const onCreateRecord = async () => {
  resetForm({ values: {} }, { force: true });
  toast.add({
    severity: 'success',
    summary: 'Інформація',
    detail: 'Введіть новий запис',
    life: 5000
  });
};

const onRemoveRecord = async () => {
  if (!values?.id) {
    return toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Запис не вибрано',
      life: 5000
    });
  }
  confirm.require({
    message: 'Ви бажаєте видалити цей запис?',
    header: 'Підтвердити видалення запису',
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne(values);
        toast.add({
          severity: 'success',
          summary: 'Інформація',
          detail: 'Запис видалено',
          life: 5000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Запис не видалено',
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення запису не підтверджено',
        life: 5000
      });
    }
  });
};

const onSaveRecord = handleSubmit(async values => {
  try {
    if (values?.id) {
      await updateOne(values.id, controlledValues.value);
    } else {
      await createOne(controlledValues.value);
    }
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: values?.id ? 'Запис оновлено' : 'Запис створено',
      life: 5000
    });
    visible.value = false;
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: values?.id ? 'Запис не оновлено' : 'Запис не створено',
      life: 5000
    });
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
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="network-mailbox" :size="42" class="mr-4" />
          <div>
            <p class="line-height-2 text-lg font-bold">Поштова скринька</p>
            <p class="line-height-2 text-base font-normal text-surface-500">
              {{ values?.id ? 'Редагувати обраний запис' : 'Створити новий запис' }}
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
            v-tooltip.bottom="'Меню опцій'"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form class="flex flex-col gap-y-4 md:flex-row md:flex-wrap" @submit.prevent="onSaveRecord">
      <div class="flex flex-col space-y-4 md:w-1/2 md:pr-2">
        <div class="flex flex-col gap-2">
          <label for="dateOpen" class="font-bold">Дата відкриття</label>
          <Calendar
            showIcon
            showButtonBar
            dateFormat="dd.mm.yy"
            inputId="dateOpen"
            v-model="dateOpen"
            v-bind="dateOpenAttrs"
            :modelValue="dateToStr(values.dateOpen)"
            placeholder="Дата відкриття"
            :invalid="!!errors?.dateOpen"
            aria-describedby="dateOpen-help"
            :pt="{
              dropdownbutton: {
                root: {
                  class: [
                    'relative',
                    'items-center inline-flex text-center align-bottom',
                    'rounded-r-md',
                    'px-4 py-3 leading-none',
                    'text-surface-500 dark:text-surface-300',
                    'border border-l-0 border-surface-300 dark:border-surface-600',
                    'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
                  ]
                }
              }
            }"
          />
          <small id="dateOpen-help" class="text-red-500" v-if="errors?.dateOpen">
            {{ errors.dateOpen }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="reqnum" class="font-bold">Номер листа</label>
          <InputText
            id="reqnum"
            v-model="reqnum"
            v-bind="reqnumAttrs"
            placeholder="Номер листа"
            :invalid="!!errors?.reqnum"
            aria-describedby="reqnum-help"
          />
          <small id="reqnum-help" class="text-red-500" v-if="errors?.reqnum">
            {{ errors.reqnum }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="login" class="font-bold">Електронна пошта</label>
          <InputText
            id="login"
            v-model="login"
            v-bind="loginAttrs"
            placeholder="Електронна пошта"
            :invalid="!!errors?.login"
            aria-describedby="login-help"
          />
          <small id="login-help" class="text-red-500" v-if="errors?.login">
            {{ errors.login }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="dateClose" class="font-bold">Дата закриття</label>
          <Calendar
            showIcon
            showButtonBar
            dateFormat="dd.mm.yy"
            aria-describedby="dateClose-help"
            inputId="dateClose"
            v-model="dateClose"
            v-bind="dateCloseAttrs"
            :modelValue="dateToStr(values.dateClose)"
            placeholder="Дата закриття"
            :pt="{
              dropdownbutton: {
                root: {
                  class: [
                    'relative',
                    'items-center inline-flex text-center align-bottom',
                    'rounded-r-md',
                    'px-4 py-3 leading-none',
                    'text-surface-500 dark:text-surface-300',
                    'border border-l-0 border-surface-300 dark:border-surface-600',
                    'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
                  ]
                }
              }
            }"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="comment" class="font-bold">Коментар</label>
          <Textarea
            id="comment"
            rows="6"
            class="outline-none"
            v-model="comment"
            v-bind="commentAttrs"
            placeholder="Коментар"
          />
        </div>
      </div>

      <div class="flex flex-col space-y-4 md:w-1/2 md:pl-2">
        <div class="flex flex-col gap-2">
          <label for="client-info" class="font-bold">Обліковий запис</label>
          <div class="flex flex-col gap-2" id="client-info">
            <div class="flex flex-col gap-2">
              <InputText
                id="fullname"
                v-model="fullname"
                v-bind="fullnameAttrs"
                placeholder="Повне ім'я"
                v-tooltip.bottom="'Повне ім\'я'"
                :invalid="!!errors?.fullname"
                aria-describedby="fullname-help"
              />
              <small id="fullname-help" class="text-red-500" v-if="errors?.fullname">
                {{ errors.fullname }}
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <InputText
                id="phone"
                v-model="phone"
                v-bind="phoneAttrs"
                placeholder="Номер телефону"
                v-tooltip.bottom="'Номер телефону'"
                :invalid="!!errors?.phone"
                aria-describedby="phone-help"
              />
              <small id="phone-help" class="text-red-500" v-if="errors?.phone">
                {{ errors.phone }}
              </small>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="location" class="font-bold">Розташування</label>
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
              filterPlaceholder="Пошук"
              placeholder="Розташування"
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
                <div class="flex h-full items-center justify-center text-base uppercase">
                  {{ option.group }}
                </div>
              </template>
              <template #option="{ option }">
                <div class="flex h-full items-center text-base">
                  {{ option.name }}
                </div>
              </template>
            </Dropdown>

            <BtnDBTable table="location" />
          </div>

          <small id="location-help" class="text-red-500" v-if="errors?.location">
            {{ errors.location }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="organizations" class="font-bold">Організація</label>
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
                  filterPlaceholder="Пошук"
                  placeholder="Організація"
                  v-tooltip.bottom="'Організація'"
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
                {{ errors.organization }}
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
                  :optionLabel="
                    option => {
                      return option.code && option.code !== option.name
                        ? `${option.code} - ${option.name}`
                        : option.name;
                    }
                  "
                  inputId="subdivision"
                  v-model="subdivision"
                  v-bind="subdivisionAttrs"
                  :options="subdivisions"
                  filterPlaceholder="Пошук"
                  placeholder="Підрозділ"
                  v-tooltip.bottom="'Підрозділ'"
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
                {{ errors.subdivision }}
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex w-full flex-row gap-2">
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
                  filterPlaceholder="Пошук"
                  placeholder="Відділ"
                  v-tooltip.bottom="'Відділ'"
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
                {{ errors.department }}
              </small>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="position" class="font-bold">Посада</label>

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
              filterPlaceholder="Пошук"
              placeholder="Посада"
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
            {{ errors.position }}
          </small>
        </div>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" label="Скасувати" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" label="Зберегти" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
