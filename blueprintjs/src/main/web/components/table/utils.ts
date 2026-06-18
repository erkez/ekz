export function stopPropagation(event: React.SyntheticEvent): void {
    event.stopPropagation();
    event.preventDefault();
}
