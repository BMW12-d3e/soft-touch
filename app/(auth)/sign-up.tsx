import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SignUpForm } from '@/components/sign-up-form'

export default function SignUp() {
  return (
    <View>
      <Text>welcome to the sign-up page</Text>
      <SignUpForm/>
    </View>
  )
}

const styles = StyleSheet.create({})