<script lang="ts">
	import Gravity from './lib/gravity/gravity.svelte';
	import SettingGroup from './lib/settings/setting-group.svelte';
	import Setting from './lib/settings/setting.svelte';
	import Sidebar from './lib/settings/sidebar.svelte';
</script>

<main>
	<Sidebar title="Settings" hide={true}>
		<SettingGroup title="Physics">
			<Setting label="Gravity" type="number" />
			<Setting label="Max Velocity" type="number" />
		</SettingGroup>
		<SettingGroup title="Simulation">
			<Setting label="Speed" type="number" />
			<Setting label="Step" type="number" />
			<Setting label="Pause" />
			<Setting label="Reset" />
		</SettingGroup>
		<SettingGroup title="Rendering">
			<Setting label="Particle Color" type="color" />
			<Setting label="Show Cube Tree" />
		</SettingGroup>
	</Sidebar>

	<Gravity />
</main>

<style>
	:global(body) {
		background-color: black;
	}

	main {
		overflow: hidden;
	}
</style>
