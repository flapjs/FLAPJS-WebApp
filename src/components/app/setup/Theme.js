export function register(styleRegistry)
{
    styleRegistry.registerStyle('--primary');
    styleRegistry.registerComputedStyle('--primary-dark', '--primary', 'darken');
    
    styleRegistry.registerStyle('--accent');
    styleRegistry.registerComputedStyle('--accent-dark', '--accent', 'darken');
    
    styleRegistry.registerStyle('--content-main');
}
