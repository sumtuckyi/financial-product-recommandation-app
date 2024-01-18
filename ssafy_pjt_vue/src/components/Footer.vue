<!-- Footer.vue -->
<template>
    <footer>
      <div class="footer-content">
        <p>&copy; 2023 BankMATE. All rights reserved.</p>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
        <div class="social-icons">
          <a href="#" rel="noopener noreferrer"><i class="fab fa-facebook"></i></a>
          <a href="#" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>
          <a href="#" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
        </div>
      </div>
    </footer>
</template>
  
<script>

</script>

<style scoped>
.social-icons {
    display: flex;
    align-items: center;
  }
  .social-icons a {
    margin-right: 10px;
    color: #1b0202;
    text-decoration: none;
    font-size: 25px;
  }
footer {
border-top: 1px solid #eee;
color: #000;
padding: 20px 0;
text-align: center;
z-index: 9000;
position: relative;
}

.footer-content {
display: flex;
justify-content: space-between;
max-width: 800px;
margin: 0 auto;
}

nav ul {
list-style: none;
padding: 0;
margin: 0;
display: flex;
}

nav li {
margin-right: 20px;
}

nav a {
color: #000;
text-decoration: none;
}
</style>
