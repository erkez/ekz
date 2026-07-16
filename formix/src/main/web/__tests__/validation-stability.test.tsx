import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { useField } from '../fields';
import { useFormWithFields, withForm } from '../form';
import { defineField } from '../references';
import { useFieldValidation } from '../validation/fields';

/**
 * A field carrying a *passing* validation must not change `useField` identity across unrelated
 * re-renders. `getValidationResult` reduces into a fresh object per call, so without collapsing the
 * no-error/no-pending case back to the frozen singleton, every validated field's `useField` result
 * is new each render — which busts any `useMemo`/effect keyed on it (e.g. a paginated-list query,
 * whose debounced fetch then never settles).
 */
describe('useField identity is stable for a passing validated field', () => {
    it('does not change reference across an unrelated re-render', async () => {
        const user = userEvent.setup();
        const seen: Array<unknown> = [];

        const Form = withForm(function Form() {
            const [, forceRender] = React.useState(0);
            const { fields } = useFormWithFields(() => ({ name: defineField('ok') }), []);

            useFieldValidation(fields.name, () => null);
            const field = useField(fields.name);
            seen.push(field);

            return <button onClick={() => forceRender((n) => n + 1)}>rerender</button>;
        });

        const { findByText } = render(<Form />);
        const button = await findByText('rerender');

        const before = seen.length;
        await user.click(button);

        expect(seen.length).toBeGreaterThan(before);
        expect(seen[seen.length - 1]).toBe(seen[before - 1]);
    });
});
