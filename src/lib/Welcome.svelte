<main>
	<pre>
m4xdev % ./bio
 __  __                          _ _   _____    __      __       
|  \/  |                        | | | |  __ \   \ \    / /       
| \  / | __ ___  ____      _____| | | | |  | | __\ \  / /__  ___ 
| |\/| |/ _` \ \/ /\ \ /\ / / _ \ | | | |  | |/ _ \ \/ / _ \/ __|
| |  | | (_| |&gt;  &lt;  \ V  V /  __/ | | | |__| |  __/\  / (_) \__ \
|_|  |_|\__,_/_/\_\  \_/\_/ \___|_|_| |_____/ \___| \/ \___/|___/
                                                                
Developer | Creator | Artist

m4xdev % <span class="blink">|</span>





            </pre>
	<pre class="ascii-train-scroll">
                ___       _       _                                                   _                                                                          _                                   _         _                      
       <span class="blink2">o</span> <span class="blink3">O</span> <span class="blink4">O</span>   / __|     (_)     | |_      ___          <span class="blink2">o</span> <span class="blink3">O</span
		> <span class="blink4">O</span>    _  _     _ _      __| |     ___       _ _          <span class="blink2">o</span> <span class="blink3">O</span> <span class="blink4">O</span
		>    __       ___     _ _       ___     | |_       _ _    _  _      __      | |_      (_)      ___     _ _    
      <span class="blink1">o</span>        \__ \     | |     |  _|    / -_)        <span class="blink1">o</span>        | +| |   | ' \    / _` |    / -_)     | '_|        <span class="blink1">o</span
		>        / _|     / _ \   | ' \     (_-&lt;     |  _|     | '_|  | +| |    / _|     |  _|     | |     / _ \   | ' \   
     TS__[O]   |___/    _|_|_    _\__|    \___|        TS__[O]   \_,_|   |_||_|   \__,_|    \___|    _|_|_        TS__[O]   \__|_    \___/   |_||_|    /__/_    _\__|    _|_|_    \_,_|    \__|_    _\__|    _|_|_    \___/   |_||_|  
     &#123;======| _|"""""| _|"""""| _|"""""| _|"""""|      &#123;======| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""|      &#123;======| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| 
    /o--000' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-'     ./o--000' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-'     ./o--000' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' 
    </pre>
</main>

<style>
	* {
		margin: 0;
		padding: 0;
	}

	body {
		background-color: black;
		display: flex;
		flex-direction: column;
		justify-items: center;
		align-items: center;
	}

	main {
		min-height: 50vh;
		width: 50rem;
		color: rgb(37, 173, 37);
		padding: 1rem 0;
		overflow: hidden;
	}

	.blink {
		animation: 1s blink step-end infinite;
	}

	@keyframes blink {
		from,
		to {
			color: transparent;
		}
		50% {
			color: rgb(37, 173, 37);
		}
	}

	.ascii-train-scroll {
		position: relative;
		width: 100%;
		animation: 15s train linear infinite;
		transform: translateX(-200%);
	}

	@keyframes train {
		0% {
			transform: translateX(80%);
		}
		100% {
			transform: translateX(-216%);
		}
	}

	.blink1 {
		animation: 1s blink1 step-end infinite;
	}

	@keyframes blink1 {
		from {
			color: rgb(37, 173, 37);
		}
		25% {
			opacity: 0.5;
		}
		50% {
			color: transparent;
			opacity: 0;
		}
		75% {
			color: transparent;
		}
		to {
			color: transparent;
		}
	}

	.blink2 {
		animation: 1s blink2 step-end infinite;
	}

	@keyframes blink2 {
		from {
			color: transparent;
		}
		25% {
			color: rgb(37, 173, 37);
		}
		50% {
			opacity: 0.5;
		}
		75% {
			color: transparent;
			opacity: 0;
		}
		to {
			color: transparent;
		}
	}

	.blink3 {
		animation: 1s blink3 step-end infinite;
	}

	@keyframes blink3 {
		from {
			color: transparent;
		}
		25% {
			color: transparent;
		}
		50% {
			color: rgb(37, 173, 37);
		}
		75% {
			opacity: 0.5;
		}
		to {
			color: transparent;
			opacity: 0;
		}
	}

	.blink4 {
		animation: 1s blink4 step-end infinite;
	}

	@keyframes blink4 {
		from {
			color: transparent;
		}
		25% {
			color: transparent;
		}
		50% {
			color: transparent;
		}
		75% {
			color: rgb(37, 173, 37);
		}
		to {
			color: transparent;
			opacity: 0;
		}
	}
</style>
