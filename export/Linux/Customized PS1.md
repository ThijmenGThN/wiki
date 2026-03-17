### **Customizing Your Terminal Prompt with PS1 Scripts**

You can enhance your terminal's appearance by modifying the `PS1` variable in your `.bashrc` file. Below are two examples of PS1 scripts, along with instructions on how to use them.

#### **Script 1: Dynamic Prompt with User and Host Information**

```bash
export PS1='\[\e[0;1m\]\u\[\e[0m\]@\[\e[0;1m\]\H \[\e[0;36m\]\w \[\e[0m\]\$ '
```

- **What it does**: This prompt displays:
  - The username (`\u`)
  - The hostname (`\H`)
  - The current working directory (`\w`)
  - A `$` symbol to indicate the shell is ready for input
- **Formatting**: The username and hostname are bold, and the working directory is highlighted in teal.
- **Use case**: Ideal for users who need a clear view of the current user, host, and directory while navigating remote servers or multi-user systems.

#### **Script 2: Personalized Prompt**

```bash
export PS1='\[\e[0;1m\]ThijmenGThN \[\e[0;36m\]\w \[\e[0m\]\$ '
```

- **What it does**: This prompt is personalized with a static label, "ThijmenGThN," followed by:
  - The current working directory (`\w`)
  - A `$` symbol for input
- **Formatting**: The label is bold, and the directory is highlighted in teal.
- **Use case**: Perfect for personal setups where a static identifier (like a custom username) is desired for aesthetic or branding purposes.

### **How to Use These Scripts**

1. **Edit your `.bashrc` file**:
   Open your `.bashrc` file in a text editor:
   ```bash
   nano ~/.bashrc
   ```

2. **Add the desired script**:
   Paste one of the scripts at the end of the file.

3. **Apply the changes**:
   Save the file and reload the shell configuration by running:
   ```bash
   source ~/.bashrc
   ```

4. **Enjoy your new prompt**:
   Your terminal prompt will now display according to the selected script!

Feel free to tweak the scripts to match your personal preferences or workflow needs. For example, you can add the current time, change colors, or adjust formatting.
