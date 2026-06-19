---
sidebar_position: 1
title: Form shell
---

# Form shell

Use `withForm` at the root of a form (page, modal, or wizard step) and `useForm` inside child components.

## withForm

`withForm` wraps your component in `FormProvider` so descendants can call `useForm`, `useField`, and validation hooks.

```tsx
export const EditProfileModal = withForm(function EditProfileModal(props: ModalProps) {
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <ProfileForm onSave={props.onSave} onClose={props.onClose} />
        </Modal>
    );
});
```

## useForm

Inside the form tree:

```tsx
const { getValues, modified, valid, reset } = useForm();
```

| Property | Meaning |
| -------- | ------- |
| `getValues(ref)` | Current value for a `FieldRef` or `ArrayFieldRef` |
| `modified` | User has changed at least one field since mount/reset |
| `valid` | All registered validators pass |
| `reset()` | Reset touched/modified state (after successful save) |

## Gating submit

Disable primary actions when the form is invalid or unchanged:

```tsx
<button type="submit" disabled={!modified || !valid}>
    Save
</button>
```

For create-only flows you may omit `modified`; for edit flows require both so users cannot submit a pristine form.

## Serializing for APIs

Keep validation out of serializers. Map `getValues` to your DTO in a pure helper:

```tsx
export function getProfileValues(
    refs: ProfileFieldRefs,
    getValues: FormApi['getValues'],
): ProfilePayload {
    return {
        name: getValues(refs.name),
        tags: getValues(refs.tags).toArray(),
    };
}
```

Throwing in serializers couples UI to API errors — prefer `useFieldValidation` for user-facing rules.

## Server errors

Network or API failures after submit are separate from field validation. Show them in a banner or callout; do not replace field-level errors unless the server returns per-field messages you map onto refs.
