import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { formatFileSize } from '@ares/utils';

export default function HomeScreen() {
    const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [status, setStatus] = useState<string>('');

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets.length > 0) {
                setSelectedFile(result.assets[0]);
                setStatus('File selected — conversion ready');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to pick a file');
        }
    };

    const handleConvert = () => {
        if (!selectedFile) return;
        setStatus('Converting... (native conversion coming soon)');
        // TODO: Integrate native FFmpeg or WASM conversion
        setTimeout(() => {
            setStatus('Conversion complete — native engines coming soon!');
        }, 1500);
    };

    return (
        <View style={styles.container}>
            {/* Header area */}
            <View style={styles.header}>
                <View style={styles.logoBadge}>
                    <Text style={styles.logoText}>A</Text>
                </View>
                <Text style={styles.title}>Ares Converter</Text>
                <Text style={styles.subtitle}>Privacy-First File Converter</Text>
            </View>

            {/* Upload area */}
            <TouchableOpacity style={styles.uploadZone} onPress={pickFile} activeOpacity={0.7}>
                <Text style={styles.uploadIcon}>📁</Text>
                <Text style={styles.uploadTitle}>Tap to select a file</Text>
                <Text style={styles.uploadHint}>All processing happens locally on your device</Text>
            </TouchableOpacity>

            {/* Selected file */}
            {selectedFile && (
                <View style={styles.fileCard}>
                    <Text style={styles.fileName} numberOfLines={1}>
                        {selectedFile.name}
                    </Text>
                    <Text style={styles.fileSize}>
                        {formatFileSize(selectedFile.size ?? 0)}
                    </Text>
                </View>
            )}

            {/* Convert button */}
            <TouchableOpacity
                style={[styles.convertBtn, !selectedFile && styles.disabledBtn]}
                onPress={handleConvert}
                disabled={!selectedFile}
                activeOpacity={0.8}
            >
                <Text style={styles.convertBtnText}>Convert</Text>
            </TouchableOpacity>

            {/* Status */}
            {status ? (
                <Text style={styles.status}>{status}</Text>
            ) : null}

            {/* Privacy badge */}
            <View style={styles.privacy}>
                <Text style={styles.privacyText}>🔒 No cloud uploads · No tracking · Fully offline</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b',
        padding: 24,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 32,
    },
    logoBadge: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    logoText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
    },
    title: {
        color: '#fafafa',
        fontSize: 24,
        fontWeight: '700',
    },
    subtitle: {
        color: '#71717a',
        fontSize: 13,
        marginTop: 4,
    },
    uploadZone: {
        width: '100%',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#27272a',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        marginBottom: 20,
    },
    uploadIcon: {
        fontSize: 36,
        marginBottom: 12,
    },
    uploadTitle: {
        color: '#fafafa',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    uploadHint: {
        color: '#71717a',
        fontSize: 12,
        textAlign: 'center',
    },
    fileCard: {
        width: '100%',
        backgroundColor: '#121215',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#27272a',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    fileName: {
        color: '#fafafa',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
        marginRight: 12,
    },
    fileSize: {
        color: '#71717a',
        fontSize: 12,
    },
    convertBtn: {
        width: '100%',
        backgroundColor: '#6366f1',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    disabledBtn: {
        backgroundColor: '#1a1a1f',
    },
    convertBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    status: {
        color: '#a1a1aa',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 20,
    },
    privacy: {
        position: 'absolute',
        bottom: 40,
    },
    privacyText: {
        color: '#3f3f46',
        fontSize: 11,
        textAlign: 'center',
    },
});
