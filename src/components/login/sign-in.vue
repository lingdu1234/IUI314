<!-- sign_in -->
<template>
  <div class="sigin-container b-container" id="b-container">
    <form class="form" id="b-form">
      <h2 class="form_title title">Sign in to Website</h2>
      <!-- <div class="form__icons">
        <img class="form__icon" src=" " />
        <img class="form__icon" src=" " />
        <img class="form__icon" src=" " />
      </div> -->
      <span class="form__span">or use your email account</span>
      <input class="form__input" type="text" placeholder="用户名" />
      <input class="form__input" type="password" placeholder="密码" />
      <input class="form__input" type="text" placeholder="验证码" />
      <!-- <a class="form__link">Forgot your password?</a> -->
      <button class="form__button button">SIGN IN</button>
    </form>
  </div>
</template>
<style lang="scss" scoped>
.sigin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  margin: auto auto;

  top: 0;
  width: 600px;
  height: 100%;
  padding: 25px;

  background-color: var(--login-neu-1);
  transition: var(--login-neu-transition);
}

.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &__icon {
    object-fit: contain;
    width: 30px;
    margin: 0 5px;
    opacity: 0.5;
    transition: 0.15s;

    &:hover {
      opacity: 1;
      transition: 0.15s;
      cursor: pointer;
    }
  }

  &__input {
    width: 350px;
    height: 40px;
    margin: 4px 0;

    padding-left: 25px;
    font-size: 13px;
    letter-spacing: 0.15px;
    border: none;
    outline: none;

    font-family: 'Montserrat', sans-serif;
    background-color: var(--login-neu-1);
    transition: 0.25s ease;
    border-radius: 8px;

    box-shadow: inset 2px 2px 4px var(--login-neu-2),
      inset -2px -2px 4px var(--login-white);

    &:focus {
      box-shadow: inset 4px 4px 4px var(--login-neu-2),
        inset -4px -4px 4px var(--login-white);
    }
  }

  &__span {
    margin-top: 30px;
    margin-bottom: 12px;
  }

  &__link {
    color: var(--login-black);
    font-size: 15px;
    margin-top: 25px;
    border-bottom: 1px solid var(--login-gray);
    line-height: 2;
  }
}

.title {
  font-size: 34px;
  font-weight: 700;
  line-height: 3;
  color: var(--login-black);
}

.description {
  font-size: 14px;
  letter-spacing: 0.25px;
  text-align: center;
  line-height: 1.6;
}

.button {
  width: 180px;
  height: 50px;
  border-radius: 25px;
  margin-top: 50px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1.15px;

  background-color: var(--login-purple);
  color: var(--login-white);
  box-shadow: 8px 8px 16px var(--login-neu-2), -8px -8px 16px var(--login-white);

  border: none;
  outline: none;
}
.b-container {
  left: calc(100% - 600px);
  z-index: 0;
}
</style>
