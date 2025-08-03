# web3forms documentation for how to use with svelte 5 for form submission

Here's a simple working contact form code example for Svelte with Web3Forms

`
<script>
let status = $state("");

const handleSubmit = async (event) => {
  status = 'Submitting...'
  const formData = new FormData(event.currentTarget)
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
      },
      body: json
  });
  const result = await response.json();
  if (result.success) {
      console.log(result);
      status = result.message || "Success"
  }
}
</script>

<form onsubmit={handleSubmit}>
    <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
    <input type="text" name="name" required />
    <input type="email" name="email" required />
    <textarea name="message" required rows="3"></textarea>
    <input type="submit" />
</form>

<div>{status}</div>
`